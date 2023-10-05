export default class Tabs {
  constructor(contents,navs){
    this.contents = document.querySelectorAll(contents);
    this.navs = document.querySelectorAll(navs);
  }

  init() {
    this.contents[0].classList.add('active');
    this.navs[0].classList.add('active');

    this.navs.forEach(nav => {
      nav.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.navs.forEach(item => {
          item.classList.remove('active');
        });
        nav.classList.add('active');
        this.contents.forEach(item => {
          item.classList.remove('active');
        });
        let currentContent = document.getElementById(nav.dataset.id);
        currentContent.classList.add('active');
      })
    })
  }
}