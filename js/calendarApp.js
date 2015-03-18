(function(){
	angular.module('calendarApp', [])
		.controller('MonthSelector', function(){

			var now = new Date();
			this.today = [now.getFullYear(), now.getMonth()+1, now.getDate()];

			this.year = this.today[0];
			this.month = this.today[1];
			this.preMonthDaysRange = [];
			this.thisMonthDaysRange = [];
			this.nextMonthDaysRange = [];

			this.changeMonth = function(act){//act -1: preMonth, 1: nextMonth
				if(act < 1){
					--this.month;
					if(this.month < 1){
						this.month = 12;
						--this.year;
					}
				}else if(act > 0){
					++this.month;
					if(this.month > 12){
						this.month = 1;
						++this.year;
					}
				}

				var preMonthLength = new Date(this.year, this.month-1, 0).getDate(); //上個月的天數
				var w = new Date(this.year, this.month-1, 1).getDay(); //這個月第一天為星期幾 (0~6 : 日~六)
				var cntPreMonthDays = w===0 ? 7 : w; //count 上個月要取幾天
				this.preMonthDaysRange = [preMonthLength-cntPreMonthDays+1, preMonthLength];

				var thisMonthLength = new Date(this.year, this.month, 0).getDate(); //這個月的天數
				this.thisMonthDaysRange = [1, thisMonthLength];

				var cntNextMonthDays = 42-cntPreMonthDays-thisMonthLength; //下個月要取幾天
				this.nextMonthDaysRange = [1, cntNextMonthDays];
			};
			
			this.changeMonth();

		}).controller('DateDetailCtrl', ['Horoscope', function(horoscope){
			var weekdays = ['日','一','二','三','四','五','六'];

			this.pinDetailPannel = false;

			this.year = 0;
			this.twYear = 0;
			this.month = 0;
			this.day = 0;
			this.weekDay = '';
			this.horoscope = '';

			this.setDateDetail = function(y, m, d){
				var date = new Date(y,m-1,d);
				
				this.year = y;
				this.twYear = y-1911;
				this.month = m;
				this.day = d;
				this.weekDay = '星期'+weekdays[date.getDay()];
				this.horoscope = horoscope(m,d)+'座';
			};

			this.onDateHover = function(y, m, d){
				if(this.pinDetailPannel)
					return;//pannel locked

				this.setDateDetail(y, m, d);
			};

			this.onDateClick = function(){
				this.pinDetailPannel = true;
			};

			this.onPannelCloseBtnClick = function(){
				this.pinDetailPannel = false;
			};

		}]).factory('Horoscope', function(){
			var str ="魔羯水瓶雙魚牡羊金牛雙子巨蟹獅子處女天秤天蝎射手魔羯"; 
			var arr=[20,19,21,21,21,22,23,23,23,23,22,22];

			return function(m,d){
				return str.substr(m*2-(d<arr[m-1]?2:0),2);
			};

		}).filter('range', function(){
			return function(cfg){
				//cfg = [start, end]
				//ex. {{[1,3] | range}} => [1,2,3]
				var start = cfg[0] || 0;
				var end = cfg[1] || cfg[0];			
				var output = [];

				for(var i=start; i<=end; i++){
					output.push(i);
				}
				return output;
			};
		});
})();