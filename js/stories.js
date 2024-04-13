"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDeleteBtn ? getDeleteButton() : ""}
        ${showStar ? getStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function getDeleteButton() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

function getStar(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function deleteStoryFromPage(event) {
  console.debug("deleteStoryFromPage");
  // Get the story
  const $itemToRemove = $(event.target).closest("li");
  const id = $itemToRemove.attr("id");

  // Remove the story
  await storyList.removeStory(currentUser, id);
  // Reset the list
  await putUserStoriesOnPage();

}

$ownStories.on("click", ".trash-can", deleteStoryFromPage);

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  let noStories = currentUser.ownStories.length === 0;

  if (noStories) {
    $ownStories.append("<h5>User has not added any stories yet!</h5>");
  }
  // loop through all own stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story, true);
    $ownStories.append($story);
  }

  $ownStories.show();
}

// Submitting the form
async function submitUserStory(event) {
  console.debug("submitUserStory");
  event.preventDefault();

  // Getting the info
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const data = { title, url, author, username };

  // Get the story and put it on the page
  const story = await storyList.addStory(currentUser, data);
  const storyMadeUp = generateStoryMarkup(story);
  $allStoriesList.prepend(storyMadeUp);

  // hide the form
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitUserStory);

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoritedStories.empty();

  let noStories = currentUser.favorites.length === 0;

  if (noStories) {
    $favoritedStories.append("<h5>User has not added any favorites yet!</h5>");
  }
  // loop through all own stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story, true);
    $favoritedStories.append($story);
  }

  $favoritedStories.show();
}

async function addOrRemoveFavorite(event) {
  console.debug("addOrRemoveFavorite");
  const target = $(event.target);
  const $itemToFavorite = target.closest("li");
  const id = $itemToFavorite.attr("id");
  const story = storyList.stories.find(s => s.storyId === id);
  console.log(target);

  const isAlreadyFav = target.hasClass("fas");
  if (isAlreadyFav) {
    await currentUser.removeFavorite(story);
    target.closest("i").removeClass("fas");
    target.closest("i").addClass("far");
  } else {
    await currentUser.addFavorite(story);
    target.closest("i").removeClass("far");
    target.closest("i").addClass("fas");
  }
}

$storiesLists.on("click", ".star", addOrRemoveFavorite);