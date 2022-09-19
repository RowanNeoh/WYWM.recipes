let apiKey = "e744ca9ae0e54982bcfa99ad445081d1";

/***Get cuisine info from country link***/
function getCuisine(country) {  

    document.getElementById("loadingIcon").style.display = "block";
    const listsPerPage = (document.getElementById("listsPerPage").value == "") ? 10 : document.getElementById("listsPerPage").value;

		$.ajax({
					type : "GET",					          
          url : "https://api.spoonacular.com/recipes/complexSearch?apiKey="+apiKey+"&number="+listsPerPage+"&cuisine="+country+"",
					success : function(res) {            
            let result = res.results;
            let num = 0;
            let lists = "<div class='row'><br /><h2> <b><font color=cadetblue>"+country+"</font> Cuisine</b></h2>";
        Object.keys(result).forEach(
            function(k) {
              let title = result[num].title;
              const imgUrl = result[num].image;
              const cuisineId = result[num].id;                                   
              
              if (title.length > 25){
                  title = "<abbr title='"+title+"'>"+title.substring(0, 24)+". . . . </abbr>";
              }
              let imgCard= "<div class='card image-card'> <img src='"+imgUrl+"' class='card-img-top' alt='Image'>"+
                              "<button type='button' class='btn btn-outline-primary buttonColor' onclick='getCuisineInfo("+cuisineId+")'><div class='card-body'>"+
                                "<p class='card-text' style='text-align:center;'>"+title+"</p>"+                                            
                              "</div></button>"+
                            "</div>";
              lists += "<div class='col'>"
                          +imgCard+"<br />"+
                        "</div>";
                num++;
            });
            lists += "</div>"                        
            document.getElementById("food_list").innerHTML = lists;
					},
					complete : function() {
						document.getElementById("loadingIcon").style.display = "none";
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						document.getElementById("loadingIcon").style.display = "none";
					}
				});
	
}

function SearchCuisine() {
  
  let query = document.getElementById("searchQuery").value;

  /**Check empty search input**/
  if (query == "" || query == null){
    document.getElementById("popupErrMsg").innerHTML = "<font class='errMsg'>Please enter food/cuisine name.</font>";
    $("#popupMsg_modal").modal("show");
    return;
  }else if (query.length <= 3){    
    document.getElementById("popupErrMsg").innerHTML = "<font class='errMsg'>Please enter at least 4 characters</font>";
    $("#popupMsg_modal").modal("show");
    return;
  }

  /**Get "Show result" per page value**/
  const listsPerPage = (document.getElementById("listsPerPage").value == "") ? 10 : document.getElementById("listsPerPage").value;  
  document.getElementById("loadingIcon").style.display = "block";

		$.ajax({
					type : "GET",                     
          url : "https://api.spoonacular.com/recipes/autocomplete?apiKey="+apiKey+"&number="+listsPerPage+"&query="+query+"",
					success : function(res) {
            console.log(JSON.stringify(res));

                    let num = 0;
                    let lists = "<div class='row'>";

                    if (res.length > 0){
                   
                    Object.keys(res).forEach(
                        function(k) {
                          let title = res[num].title;
                          
                          const cuisineId = res[num].id;
                          let encodeId = btoa(cuisineId);                          
                          if (title.length > 23){
                              title = title.substring(1, 3);
                          }
                          let imgCard= "<div class='card' style='width: 18rem;'> <img src='https://spoonacular.com/recipeImages/"+cuisineId+"-312x231.jpg' class='card-img-top' alt='Image'>"+
                                          "<button type='button' class='btn btn-outline-primary buttonColor' onclick='getCuisineInfo("+cuisineId+")'><div class='card-body'>"+
                                            "<p class='card-text' style='text-align:center;'>"+title+"</p>"+
                                            
                                          "</div></button>"+
                                        "</div>";
                          lists += "<div class='col'>"
                                      +imgCard+"<br />"+
                                    "</div>";
                            num++;
                        });
                      }else{
                        lists += "<div class='col'><h2>No result was found.</h2></div>";
                      }
                        lists += "</div>"                        
                        document.getElementById("food_list").innerHTML = lists;
					},
					complete : function() {
						document.getElementById("loadingIcon").style.display = "none";
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						document.getElementById("loadingIcon").style.display = "none";
					}
				});	
}

/***Get food/cuisine info with food id***/
function getCuisineInfo(foodId) {  
  document.getElementById("loadingIcon_modal").style.display = "block";
  $("#exampleModalXl").modal("show");
  $.ajax({
              type : "GET",               
              url : "https://api.spoonacular.com/recipes/"+foodId+"/information?apiKey="+apiKey+"&includeNutrition=false",
              success : function(res) {
                console.log(JSON.stringify(res));
                  document.getElementById("fdDetail_vegan").innerHTML = (res.vegan == true) ? "Yes" : "No";
                  document.getElementById("fdDetail_glutenFree").innerHTML = (res.glutenFree == true) ? "Yes" : "No";
                  document.getElementById("fdDetail_dairyFree").innerHTML = (res.dairyFree == true) ? "Yes" : "No";
                  document.getElementById("fdDetail_healthScore").innerHTML =res.healthScore;
                  document.getElementById("fdDetail_healthy").innerHTML = (res.veryHealthy == true) ? "Yes" : "No";
                  document.getElementById("fdDetail_readyInMinutes").innerHTML = res.readyInMinutes;
                  document.getElementById("fdDetail_servings").innerHTML = res.servings;
                  
                  
                  let disheTitle = res.title;                  
                  let dishImg = res.image;
                  let dishSummary = res.summary;

                  document.getElementById("dishName").innerHTML = disheTitle;
                  document.getElementById("dishSummary").innerHTML = dishSummary;                                        
                  document.getElementById("dishImg").innerHTML =  "<img src='"+dishImg+"' style='border-radius:50%;' class='img-fluid' alt='DishName'/>";
  
                  /***Dish preparation steps***/
                  let resanalyzedInstructions = res.analyzedInstructions;
                  let analyNum = 0;
                  let listGroup ="<ul class='list-group'>";                
                  if (Object.keys(resanalyzedInstructions).length > 0)
                  {                       
                      Object.keys(resanalyzedInstructions).forEach(
                      function(k) {  

                              /***Get step details***/
                              let stepInstructionss = resanalyzedInstructions[analyNum].steps;
                              let stepNum = 0;

                              Object.keys(stepInstructionss).forEach(
                              function(k) {                              
                              let steps = stepInstructionss[stepNum].step;
                              let number = stepInstructionss[stepNum].number;
                              listGroup +="<li class='list-group-item'>"+number+". "+steps+"</li>";
                              stepNum++;
                              });      
                          analyNum++;
                      });
                      
                  }else {                    
                      listGroup +="<li class='list-group-item'>Instruction not available.</li>";
                  }
                  listGroup +="</ul>";
                  document.getElementById("dishInstruction").innerHTML = listGroup;
              },
              complete : function() {
                  document.getElementById("loadingIcon_modal").style.display = "none";
              },
              error : function(XMLHttpRequest, textStatus, errorThrown) {
                  document.getElementById("loadingIcon_modal").style.display = "none";
              }
          });
  
  }