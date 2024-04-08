"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

// This will run when the user wants to submit a story

function submitStory(event) {
  console.debug("submitStory", event);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navStorySubmit.on("click", submitStory);

// This will run when the user wants to view their own stories

function navUserStories(event) {
  console.debug("navMyStories", event);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navUserStories);

// This function will run when the user wants to view their favorite stories

function navFavStories(event) {
  console.debug("navFavStories", event);
  hidePageComponents();
  putFavoritesOnPage();
  $favoritedStories.show();
}

$body.on("click", "#nav-favorites", navFavStories);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
