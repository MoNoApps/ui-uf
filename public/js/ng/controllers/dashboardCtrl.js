app.controller('DashboardCtrl', function DashboardCtrl($scope, $http) {
    $scope.showLogin = true;
    $scope.showProjects = false;
    $scope.showTickets= false;
    $scope.showTimes= false;
    $scope.projects = [];
    $scope.tickets = [];
    $scope.times = [];
    $scope.timeGroup = [];
    $scope.project_id = false;
    $scope.user = {};
    $scope.token = false;
    $scope.selectedObject = '';
    $scope.selectedProject = false;
    $scope.selectedTicket = false;
    $scope.stats = {
      'Projects': $scope.projects.length,
      'Tickets': $scope.tickets.length,
      'Time entries': $scope.times.length,
      'Sum Time': 0,
      'Selected Time': 0
    };

    $scope.startDate = new Date();
    $scope.endDate = new Date();

    $scope.login = function() {
      $http.post('/api/login',$scope.user)
      .success(function(data){
        if(data.err){
          $scope.message = {
            body: 'Check your credentials. We can not login you into unfuddle website.',
            title: 'Invalid Credentials'
          };

          $('#messageModal').modal('show');
        }else{
          $scope.token = data.data;
          localStorage.setItem('token', $scope.token);
          $scope.projectList();
        }
      })
      .error(function(){
        console.log("error")
      });
    };

    $scope.logout = function(){
      localStorage.removeItem('token');
      location.reload();
    };

    $scope.projectList = function() {
      $http.get('/api/projects?token=' + $scope.token)
      .success(function(data){
        $scope.showLogin = false;
        $scope.showProjects = true;
        $scope.projects = data.projects;
      })
      .error(function(){
        //TODO:  add a message
        console.log("error")
      });
    };

    $scope.ticketList = function(project) {
      $scope.timeGroup = [];
      $scope.times = [];
      $scope.tickets = [];
      switchStatus(project, 'isProject');
      $scope.showLogin = false;
      $scope.showProjects = true;
      $scope.showTickets = true;
      $scope.project_id = project.id;

      $http.get('/api/project/'+project.id+'/tickets?token=' + $scope.token)
      .success(function(data){
        $scope.tickets = data.tickets;
      })
      .error(function(){
        console.log("error")
      });
    };

    $scope.timeList = function(ticket) {
      $scope.times = [];
      switchStatus(ticket, 'isTicket');
      $scope.showLogin = false;
      $scope.showProjects = true;
      $scope.showTickets = true;
      $scope.showTimes= true;

      $http.get('/api/project/'+$scope.project_id+'/ticket/'+ticket.id+'/times?token=' + $scope.token)
      .success(function(data){
        $scope.times = data.times;
        rebuildTimeList();
      })
      .error(function(){
        console.log("error")
      });
    };

    $scope.selectTime = function(time){
      switchStatus(time,'isTime');
    }

    $scope.checkForToken = function(){
      $scope.token = localStorage.getItem('token');
      if($scope.token){
          $scope.projectList();
      }
    };

    switchStatus = function (value, type){

      //Only one selected
      switch (type){
        case 'isProject':
          $scope.selectedProject = value;
          switchProjectList();
          break;
        case 'isTicket':
          $scope.selectedTicket = value;
          switchTicketList();
          break;
      }

      if(value.ufstatus == 'active'){
        value.ufstatus = '';
      }else{
        value.ufstatus = 'active';
      }

      //Allow many selections
      switch (type){
        case 'isTime':
          rebuildTimeList();
          break;
      }

      $scope.selectedObject = value;
    };

    rebuildTimeList = function() {
      $scope.timeGroup = [];
      $scope.stats['Sum Time'] = 0;
      $scope.stats['Selected Time'] = 0;

      for (var idx in $scope.times){
        if($scope.times[idx].ufstatus == 'active'){
          $scope.timeGroup.push($scope.times[idx]);
          $scope.stats['Selected Time'] += $scope.times[idx].hours;
        }

        $scope.stats['Sum Time'] += $scope.times[idx].hours;
      }
    };

    switchTicketList = function() {
      for (var idx in $scope.tickets){
        if($scope.tickets[idx].ufstatus == 'active'){
          $scope.tickets[idx].ufstatus = '';
        }
      }
    };

    switchProjectList = function() {
      for (var idx in $scope.projects){
        if($scope.projects[idx].ufstatus == 'active'){
          $scope.projects[idx].ufstatus = '';
        }
      }
    };

    $scope.checkForToken();

});
