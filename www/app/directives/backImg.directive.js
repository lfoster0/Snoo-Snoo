angular.module("snoosnoo").directive('backImg', function(){
    return function(scope, element, attrs, JSONObject){
        var imgURL = attrs.backImg;
        if (imgURL) {
            element.css({
                'background': "linear-gradient(-180deg, rgba(0,0,0,0.35) 100%, rgba(0,0,0,0.30) 100%), url(" + imgURL +') no-repeat',
                // 'background': "linear-gradient(-180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.80) 100%), url(" + imgURL +') no-repeat',
                'background-size': '100% auto',
                'background-position': 'center'
            });
        }
    };
});
