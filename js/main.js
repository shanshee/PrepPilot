(function ($) {
    "use strict";
	
    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow');
            } else {
                $('.fixed-top').removeClass('bg-white shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-white shadow').css('top', 0);
            }
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
	
	$(document).on("click", ".meal-type", function(){
		$(".meal-type").removeClass('active');
		$(this).addClass("active");
	});
	
	$(document).on("click", '[name="use_weight_goal"]:checked', function(){
		var use_weight_goal = $(this).val();
		if(use_weight_goal==='true'){
            $(".weight_goal_form").css({"display": "block"});
		} else {
			$(".weight_goal_form").css({"display": "none"});
		}
	});
	
	const heightCf = (cm) => {
      var realFeet = ((cm*0.393700) / 12);
      var feet = Math.floor(realFeet);
      var inches = Math.round((realFeet - feet) * 12);
      return [feet, inches];
    }
	
	const heightCm = (f, inch) => {
      var cmf = f*30.48;
	  var cmi = inch*2.54;
	  return (cmf+cmi).toFixed(0);
    }
	
	const calculateBmr = (weight, height, age, gender) => {
		if(gender==='M'){
		   var bmr = 10 * weight + 6.25 * height - 5 * age + 5;
		} else {
		   var bmr = 10 * weight + 6.25 * height - 5 * age - 161;
		}
		return bmr;
	}
	
	const calculateCalories = (bmr, activity_level) => {
		return bmr * activity_level;
	}
	
	const getCalorieGoal = (calories, goal) => {
        if(goal==="L"){
            return calories - 500;
        } else if(goal==="G"){
            return calories + 500;
        } else {
            return calories;
        }
	}
	
	const calculateMacros = (calories, weight_kg, goal) => {
		if(goal==='L'){
			var protein_g = weight_kg * 2;
			var fat_percentage = 30;
		} else if(goal==='M'){
			var protein_g = weight_kg * 1.5;
			var fat_percentage = 30;
		} else {
			var protein_g = weight_kg * 2.2;
			var fat_percentage = 25;
		}
		
		var protein_cal = protein_g * 4;
		var fat_cal = (calories * (fat_percentage / 100));
		
		var fat_g = fat_cal / 9;
		var carb_cal = calories - protein_cal - fat_cal;
		var carb_g = carb_cal / 4;
		
		return [protein_g, fat_g, carb_g];
	}
	
	const setField = (name, nutrition_profile) => {
		var elements = $(`[name="${name}"]`);
		//console.log(elements)
		elements.map((index, item) => {
			//console.log(item);
			item.checked = false;
			if(item.value===nutrition_profile[name]){
				if(name==='units' && item.value==='M'){
			    	item.checked = true;
				} else {
					item.checked = true;
					item.click();
				}
				if(name==='use_weight_goal' && item.value===nutrition_profile[name]){
					//display macros
					$(".weight_goal_form, .macro_recommendation").css("display", "block");
				}
			}
		});
		return true;
	}
	
	const loadPreSettings = () => {
	
		if (localStorage.getItem("nutrition_profile") !== null) {
			var nutrition_profile = JSON.parse(localStorage.getItem('nutrition_profile'));
			console.log(nutrition_profile);

			//update all fields
			var meal_type = $(".meal-type");
			meal_type.map((index, item) => {
				//console.log(item)
				item.classList.remove("active");
				if(item.getAttribute("data-value")===nutrition_profile.meal_type){
				   item.classList.add("active");
				}
			});
			$("#cal_input").val(nutrition_profile.adjusted_calories);

			if(nutrition_profile.units==="I"){

				var weight = parseFloat(nutrition_profile.weight);
				weight = (weight*0.453592).toFixed(0);
				if(isNaN(weight)){
					weight = 0;
				}
				var weight_goal = parseFloat(nutrition_profile.weight_goal);
				weight_goal = (weight_goal*0.453592).toFixed(0);
				if(isNaN(weight_goal)){
					weight_goal = 0;
				}
				var weight_goal_weekly_rate = parseFloat(nutrition_profile.weight_goal_weekly_rate);
				weight_goal_weekly_rate = (weight_goal_weekly_rate*0.453592).toFixed(1);
				console.log(weight_goal_weekly_rate);
				if(isNaN(weight_goal_weekly_rate)){
					weight_goal_weekly_rate = 0;
				}

				$('[name="weight"]').val(weight);
				$('[name="weight_goal"]').val(weight_goal);
				$('[name="weight_goal_weekly_rate"]').val(weight_goal_weekly_rate);
			} else {
				$('[name="weight"]').val(nutrition_profile.weight);
				$('[name="weight_goal"]').val(nutrition_profile.weight_goal);
				$('[name="weight_goal_weekly_rate"]').val(nutrition_profile.weight_goal_weekly_rate);
			}

			$('[name="height_secondary"]').val(nutrition_profile.height_cm);
			$('[name="age"]').val(nutrition_profile.age);
			$(".suggested_calories").text(nutrition_profile.adjusted_calories+" kcal");
			$(".suggested_carbs").text(nutrition_profile.carb_g.toFixed(0)+"g");
			$(".suggested_fats").text(nutrition_profile.fat_g.toFixed(0)+"g");
			$(".suggested_proteins").text(nutrition_profile.protein_g.toFixed(0)+"g");

			setField('goal', nutrition_profile);
			setField('units', nutrition_profile);
			setField('gender', nutrition_profile);

			//setField('bodyfat', nutrition_profile);

			setField('use_weight_goal', nutrition_profile);

			var elements = $(`[name="bodyfat"]`);
			elements.map((index, item) => {
				var bfat1 = parseFloat(nutrition_profile.bodyfat);
				var bfat2 = parseFloat(item.value);
				if(bfat1===bfat2){
				   item.setAttribute("checked", true);
				}
			});

			$('[name="activity_level"]').val(nutrition_profile.activity_level).change();

		}
		
	}
	
	loadPreSettings();
	
	$(document).on("click", '[name="units"]:checked', function(){
		var units = $(this).val();
		if(units==='M'){
			//convert weight
			var weight = $('[name="weight"]').val();
			weight = parseFloat(weight);
			weight = (weight*0.453592).toFixed(0);
			if(isNaN(weight)){
				weight = 0;
			}
			$('[name="weight"]').val(weight);
			// weight goal
			var weight_goal = $('[name="weight_goal"]').val();
			weight_goal = parseFloat(weight_goal);
			weight_goal = (weight_goal*0.453592).toFixed(1);
			if(isNaN(weight_goal)){
				weight_goal = 0;
			} 
			$('[name="weight_goal"]').val(weight_goal);
			$(".weight_units").text('kg');
			// weekly weight goal
			var weight_goal_weekly_rate = $('[name="weight_goal_weekly_rate"]').val();
			weight_goal_weekly_rate = parseFloat(weight_goal_weekly_rate);
			weight_goal_weekly_rate = (weight_goal_weekly_rate*0.453592).toFixed(1);
			if(isNaN(weight_goal_weekly_rate)){
				weight_goal_weekly_rate = 0;
			}
			$('[name="weight_goal_weekly_rate"]').val(weight_goal_weekly_rate);
			/////////
			//convert height
			var feet = $('[name="height_primary"]').val();
			var inch = $('[name="height_secondary"]').val();
			var heightAll = heightCm(feet, inch);
			$('[name="height_secondary"]').val(heightAll);
			/////////
            $(".metric_inputs").css({"display": "block"});
			$(".imperial_inputs").css({"display": "none"});
		} 
		else {
			//convert weight
			var weight = $('[name="weight"]').val();
			weight = parseFloat(weight);
			weight = (weight*2.20462).toFixed(0);
			if(isNaN(weight)){
				weight = 0;
			}
			$('[name="weight"]').val(weight);
			// weight goal
			var weight_goal = $('[name="weight_goal"]').val();
			weight_goal = parseFloat(weight_goal);
			weight_goal = (weight_goal*2.20462).toFixed(1);
			if(isNaN(weight_goal)){
				weight_goal = 0;
			} 
			$('[name="weight_goal"]').val(weight_goal);
			$(".weight_units").text('lbs');
			// weekly weight goal
			var weight_goal_weekly_rate = $('[name="weight_goal_weekly_rate"]').val();
			weight_goal_weekly_rate = parseFloat(weight_goal_weekly_rate);
			weight_goal_weekly_rate = (weight_goal_weekly_rate*2.20462).toFixed(1);
			if(isNaN(weight_goal_weekly_rate)){
				weight_goal_weekly_rate = 0;
			} 
			$('[name="weight_goal_weekly_rate"]').val(weight_goal_weekly_rate);
			/////////
			//convert height
			var cm = $('[name="height_secondary"]').val();
			var heightAll = heightCf(cm);
			$('[name="height_primary"]').val(heightAll[0]);
			$('[name="height_secondary"]').val(heightAll[1]);
			/////////
			$(".imperial_inputs").css({"display": "block"});
			$(".metric_inputs").css({"display": "none"});
		}
	});
	
	$(document).on("keyup", '[name="weight_goal"], [name="weight_goal_weekly_rate"]', function(){
		var weight = $('[name="weight"]').val();
		var weight_goal = $('[name="weight_goal"]').val();
		var weight_goal_weekly_rate = $('[name="weight_goal_weekly_rate"]').val();
		
		var time_week = (weight - weight_goal)/weight_goal_weekly_rate;
		console.log(time_week);
		var time_days = time_week*7;
		var newdate = new Date();
		newdate.setDate(newdate.getDate()+time_days);
		
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May","Jun","Jul", "Aug", "Sep", "Oct", "Nov","Dec"];

		var year = newdate.getFullYear();
		if(!isNaN(year)){
			$('.expected_weight_goal_date').text(`You should reach your goal in ${monthNames[newdate.getMonth()]} ${year}.`);
			$('.expected_weight_goal_date').css("display", "block");
		}
	});
	
	$(document).on("click", ".nutrition_calculator_modal", function(){
		$("#current-preset-diet span").text($(".meal-type.active").data('value').valueOf());
		loadPreSettings();
	});
	
	$(document).on("submit", "#calculator_form", function(e){
		
		e.preventDefault();
		
		//weight in kg
		var unit = $('[name="units"]:checked').val();
		var use_weight_goal = $('[name="use_weight_goal"]:checked').val();
		if(unit!=='M'){
			if(use_weight_goal==='true'){
				var weight_kg = $('[name="weight_goal"]').val();
			} else {
				var weight_kg = $('[name="weight"]').val();	
			}
			weight_kg = parseFloat(weight_kg);
			weight_kg = (weight_kg*0.453592).toFixed(0);
			
			//height in cm
			var feet = $('[name="height_primary"]').val();
			var inch = $('[name="height_secondary"]').val();
			var height_cm = heightCm(feet, inch);
			
		} else {
			if(use_weight_goal==='true'){
				var weight_kg = $('[name="weight_goal"]').val();
			} else {
				var weight_kg = $('[name="weight"]').val();	
			}
			weight_kg = parseFloat(weight_kg);
			var height_cm = $('[name="height_secondary"]').val();
		}
		
		console.log(`weight_kg ${weight_kg}`);
		console.log(`height_cm ${height_cm}`);
		
		var age = $('[name="age"]').val();
		age = parseFloat(age);
		console.log(`age ${age}`);
		
		var gender = $('[name="gender"]:checked').val();
		console.log(`gender ${gender}`);
		
		var activity_level = $('[name="activity_level"]').val();
		activity_level = parseFloat(activity_level);
		console.log(`activity_level ${activity_level}`);
		
		var goal = $('[name="goal"]:checked').val();
		console.log(`goal ${goal}`);
		
		var bmr = calculateBmr(weight_kg, height_cm, age, gender);
		console.log(`bmr ${bmr}`);
		
		var calories = calculateCalories(bmr, activity_level);
		console.log(`calories ${calories}`);
		
		var adjusted_calories = getCalorieGoal(calories, goal);
		adjusted_calories = adjusted_calories.toFixed(0);
		
		$(".macro_recommendation").css("display", "block");
		$(".suggested_calories").text(adjusted_calories+" kcal");
		$("#cal_input").val(adjusted_calories);
		
		var body_fat = $('[name="bodyfat"]:checked').val();
		body_fat = parseFloat(body_fat);
		
		var [protein_g, fat_g, carb_g] = calculateMacros(adjusted_calories, weight_kg, goal);
		$(".suggested_carbs").text(carb_g.toFixed(0)+"g");
		$(".suggested_fats").text(fat_g.toFixed(0)+"g");
		$(".suggested_proteins").text(protein_g.toFixed(0)+"g");
		
		var weight_goal_weekly_rate = $('[name="weight_goal_weekly_rate"]').val();
		
		//store all these values in local storage
		var nutrition_profile = {'goal': goal, 'units': unit, 'gender': gender, 'height_cm': height_cm, 'weight': $('[name="weight"]').val(), 'age': age, 'bodyfat': body_fat, 'activity_level': activity_level, 'use_weight_goal': use_weight_goal, 'weight_goal': $('[name="weight_goal"]').val(), 'adjusted_calories': adjusted_calories, 'carb_g': carb_g, 'fat_g': fat_g, 'protein_g': protein_g, 'meal_type': $(".meal-type.active").data('value').valueOf(), 'weight_goal_weekly_rate': weight_goal_weekly_rate};
		
		localStorage.setItem('nutrition_profile', JSON.stringify(nutrition_profile));
		
	});
	
	$(document).on("click", ".use_calculated_settings", function(){
		var nutrition_profile = JSON.parse(localStorage.getItem('nutrition_profile'));
		console.log(nutrition_profile);
		$("#nutrition_calculator_modal").modal('hide');
	});
	
	const callOpenAi = async (calories, meals, meal_type) => {
		
		//load preloader in the meal listing div
		$(".add-meals").html('<img src="img/preloader.gif" class="preloader" />');
		
		//let response = await fetch('http://localhost/prepilot/openai.php', {
		let response = await fetch('https://techfas.com/prepilot/openai.php', {	
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'calories': calories, 'meals': meals, 'meal_type': meal_type})
        });
        const content = await response.json();
		
		$(".add-meals").html("");
		
		var count = 1;
		var counter_2 = 1;
		var groceryList = '';
		var groceryArr = new Array();
		var mealbox = `<div class="row kami">`;
		content.meals.map((item) => {
			//console.log(item);
			var ingredients = item.ingredients;
			var ingredientStr = '';
			for (var key in ingredients) {
				ingredientStr += `<p class="mb-1"><small>${ingredients[key]} ${key}</small></p>`;
				if(!groceryArr.includes(key)){
					groceryArr[counter_2-1] = key;
					groceryList += `<p class="mb-1"><small>${counter_2}. ${key}</small></p>`;
					counter_2++;
				}
			}
			
			var cooking_method = item.cooking_steps;
			var cooking_methodStr = '';
			for (var key in cooking_method) {
				cooking_methodStr += `<p class="mb-1"><small>${cooking_method[key]}</small></p>`;
			}
			
			mealbox += `<div class="col-md-6">
					<div class="row m-1 py-3 meal_container meal_box">
						<div class="row food_object_row align-items-center border-bottom">
							<div class="col-md-4">
								<h5>${item.name}</h5>
								<p>${item.calories} Calories</p>
							</div>
							<div class="col-md-8">
								<h6>${item.dish_name}</h6>
								<p>Carbs: ${item.carbs} - Fat: ${item.fat} - Protein: ${item.protein}</p>
							</div>
						</div>
						<div class="row py-3 food_object_row">
							<div class="col-md-4">
								<h6>Ingredients</h6>
								${ingredientStr}
							</div>
							<div class="col-md-8">
								<h6>Method</h6>
								${cooking_methodStr}
							</div>
						</div>
					</div>
				</div>`;
			
			if(count%2===0){
				mealbox += `</div><div class="row kami">`;
			}
			count++;
		});
		
		//add to grocery list modal
		//groceryList
		$(".grocery_list_col").html(groceryList);
		$(".add-meals").append(mealbox);
	}
	
	$(document).on("click", ".generate_btn, .regenerate_btn", function(){
		
		let calories = $("#cal_input").val();
		let meals = $("#num_meals_selector").val();
		let meal_type = $(".meal-type.active").data("value").valueOf();
		
		if(meal_type===""){
			return false;
		}
		if(calories===""){
			return false;
		}
		
		callOpenAi(calories, meals, meal_type) ;
		
	})
	
	
})(jQuery);

