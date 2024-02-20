import { USER_POSTS_PAGE } from "../routes.js";
 import { renderHeaderComponent } from "./header-component.js";
 import { posts, goToPage, renderApp, setPosts } from "../index.js";
 import { formatDistanceToNow } from "date-fns";
import { disLike, like } from "../api.js";

 export function renderPostsPageComponent({ appEl }) {
   // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  // for (const id of posts.likes) {
    // id = posts.likes.id;
  // }
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */ console.log(posts);
  const postsHTML = posts.map((post) => {
    const likesCounter = post.likes.length;
    const firstLiker = "";
    //const firstLiker = String(post.likes[0]['name']);
    const moreLikers = String(" еще " + (post.likes.length - 1));
    const likersApp = (likersElement) => {
      if (likesCounter > 1) {
        return likersElement = `Нравится: <span><strong>${firstLiker}</strong></span> и <span></span><span><strong>${moreLikers}</strong></span>`;
      } else if (likesCounter === 1) {
        return likersElement = `Нравится: <span><strong>${firstLiker}</strong></span>`;
       } else { 
         return "";
       }
     };

     const createdTimeToNow = formatDistanceToNow(new Date(post.createdAt), {inincludeSeconds: true});

     return `
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="" class="like-button">
              <img style="${post.isLiked === false ? "display: block" : "display: none"}" src="./assets/images/like-not-active.svg">
              <img style="${post.isLiked === true ? "display: block" : "display: none"}" src="./assets/images/like-active.svg">
            </button>
            <p class="post-likes-text">
              ${likersApp(post)}
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
             ${post.description}
           </p>
           <p class="post-date">
             ${createdTimeToNow}
           </p>
         </li>`;
  }).join('');
  const appHtml = `
  <div class="page-container">
  <div class="header-container"></div>
  <ul class="posts">
  ${postsHTML}
  </ul>
  </div>
  `
  appEl.innerHTML = appHtml;
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  } 

  function updatePosts(posts, currentPost, post) {

    const actualPosts = posts.map (el => {
      if (currentPost.id === el.id) {
        return post.post;
      }
      return el;
    })
  
    setPosts(actualPosts)
    renderApp();
  }

  const likesButtons = document.querySelectorAll(".like-button");
  likesButtons.forEach((element, index) => {
    element.addEventListener("click", () => {
      const currentPost = posts[index];
      if(currentPost.isLiked){
        disLike(currentPost.id).then(res => updatePosts(posts, currentPost, res))
        return
      }
      like(currentPost.id).then(res => updatePosts(posts, currentPost, res))
    })
  })
}