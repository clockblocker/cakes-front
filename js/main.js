$(document).ready(function() {	

	let recipeCardObjects = [];
	const recipeCardBuilder = new RecipeCardBuilder();
	$.getJSON("http://127.0.0.1:8000/api/recipes/", data => {
		const disaRecipeObjects = data;
		for (disaRecipeObject of disaRecipeObjects) {
			recipeCardObjects.push(recipeCardBuilder.fromDisaSchema(disaRecipeObject));
		}
	}).done(() => {
		var VM = new ViewModel(recipeCardObjects);
		ko.applyBindings(VM);
	});
	/*
	$.getJSON("https://cakes.abra.me/api/v2/recipe/all", data => {
		if (data.status === "ok") {
			const allRecipeCards = data.recipes;
			for (abraRecipeCard of allRecipeCards) {
				recipeCardObjects.push(recipeCardBuilder.fromAbraSchema(abraRecipeCard));
			}
		}
	}).done(function() {
		var VM = new ViewModel(recipeCardObjects);
		ko.applyBindings(VM);
	});
	*/

	let ViewModel = function(recipeCardObjects) {
		self = this;
		let recipes = [];
		this.selected = ko.observable(false);
		this.shownRecipes = ko.observableArray();
		this.canShowMoreRecipes = ko.observable(true);
		this.selectedTags = ko.observableArray();


		this.selectTag = (tag) => {
			let checkSelectTag = this.selectedTags().indexOf(tag);
			this.selected(!this.selected());
			if (checkSelectTag == -1){
				this.selectedTags.push(tag);
			}
			else {
				this.selectedTags.splice(checkSelectTag, 1);
			}
		}

		for (recipe of recipeCardObjects) {
			recipes.push(ko.observable(new RecipeCard(recipe, this.selectedTags)));
		}

		this.showOneMoreRecipe = () => {
			if (recipes.length > 0) {
				this.shownRecipes.push(recipes.pop());
			} else {
				self.canShowMoreRecipes(false);
			}
		};

		this.showMoreRecipes = function() {
			for (let i = 0; i < 12; i++) {
				self.showOneMoreRecipe();
			}
		}

		self.showMoreRecipes();
	}; 

});
