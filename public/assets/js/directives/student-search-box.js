angular.module('studentSearchBox',[])
	.directive('studentSearchBox', function(){
		return {
			restrict : 'A',
			templateUrl: 'blocks/student.search.box.html',
			scope: true,
			link : function(scope, element, attr){
				var parent = $(element).parents('.panel-body');
				scope.$on('searchQ', function(e, q){
					
				});
				scope.q = $(element).val();
			},
			controller : function($scope){
				$scope.$watch('searchQ', function(q){
					$scope.$broadcast('searchQ', q);
				});
			}
		}
	});