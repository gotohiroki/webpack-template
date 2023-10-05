import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

const EASE01 = CustomEase.create("custom", "M0,0 C0.43,0.05 0.17,1 1,1 ");
const EASE02 = CustomEase.create("custom", "M0,0 C0.18,0.06 0.23,1 1,1 ");

let delayNum = "";
let durationNum = "";
let yNum = "";

export default class Animation {
  constructor() {
    this.init();
  }

  init() {
    this.wrapText();
    this.textSlideUp();
    this.textFadeIn();
    this.fadeUp();
    this.fadeDown();
    this.parallax();
    this.mvAnim();
  }

  _createScrollTrigger(triggerElement, timeline) {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 90%",
      onEnter: () => timeline.play(),
      // markers: true
    });
  };

  wrapText() {
    //slideUpアニメーションのために、該当のテキストを一文字づつ二重のspanで括るスクリプト
    //英数字には「.en」クラスがつく。sabonと游明朝を混植している箇所で半角英数字と日本語のサイズを視覚的に揃える場合に使用できる。（現状はタグごとに適宜cssで対応する形）
    const titleElements = document.querySelectorAll('.js-textSplit');
    titleElements.forEach((titleElement) => {
      wrapText(titleElement);
    });

    function wrapText(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const content = node.textContent;
        let formattedText = '';

        for (let i = 0; i < content.length; i++) {
          const char = content[i];

          if (char === ' ' || char === '\n') {
            formattedText += char; // 半角スペースと改行は無視して追加しない
          } else {
            const isAlphanumeric = /^[A-Za-z0-9&;]+$/.test(char);
            formattedText += `<span class="char${isAlphanumeric ? ' en' : ''}"><span class="char-inner">${char}</span></span>`;
          }
        }

        const tempElement = document.createElement('div');
        tempElement.innerHTML = formattedText;

        while (tempElement.firstChild) {
          node.parentNode.insertBefore(tempElement.firstChild, node);
        }

        node.parentNode.removeChild(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const childNodes = node.childNodes;

        for (let i = childNodes.length - 1; i >= 0; i--) {
          wrapText(childNodes[i]);
        }
      }
    }
  }

  textSlideUp() {
    this.textSlideUp = document.querySelectorAll('.js-textSlideUp');
    this.textSlideUp.forEach((target) => {

      const TL = gsap.timeline({
        paused: true
      });
      const str = target.textContent;
      const num = 10;

      //delay
      delayNum = (!target.dataset.delay) ? 0 : target.dataset.delay;

      //duration
      durationNum = (!target.dataset.duration) ? (str.length < num) ? 0.8 : 0.8 : target.dataset.duration;

      //transformY
      yNum = (!target.dataset.y) ? 100 : target.dataset.y;

      TL.fromTo(target.querySelectorAll('.char-inner'), {
        opacity: 0,
        yPercent: yNum,
      }, {
        yPercent: 0,
        opacity: 1,
        duration: durationNum,
        ease: EASE01,
        delay: delayNum,
        stagger: {
          amount: (str.length < num) ? 0.18 : 0.3,
        }
      })
      this._createScrollTrigger(target, TL);
    });
  }

  textFadeIn() {
    this.textFadeUp = document.querySelectorAll('.js-textFadeIn');
    this.textFadeUp.forEach((target) => {

      const str = target.textContent;
      const num = 10;

      //delay
      delayNum = (!target.dataset.delay) ? 0 : target.dataset.delay;

      //duration
      durationNum = (!target.dataset.duration) ? 1 : target.dataset.duration;

      gsap.set(target.querySelectorAll('.char-inner'),{
        opacity: 0,
      });

      const TL = gsap.timeline({
        paused: true,
      });

      TL.fromTo(target.querySelectorAll('.char-inner'),{
          opacity: 0,
        },{
            opacity: 1,
            duration: durationNum,
            ease: EASE02,
            delay: delayNum,
            stagger: {
              amount: (str.length < num) ? 0.18 : 0.3,
            }
        })
      this._createScrollTrigger(target, TL);
    });
  }

  fadeUp() {
    this.elements = document.querySelectorAll('.js-fadeUp');
    this.elements.forEach((element, i) => {

      //delay
      delayNum = (!element.dataset.delay) ? 0.15 : element.dataset.delay;

      //duration
      durationNum = (!element.dataset.duration) ? .6 : element.dataset.duration;

      //transformY
      yNum = (!element.dataset.y) ? 30 : element.dataset.y;

      gsap.set(element,{
        opacity: 0,
        y: yNum,
      });


      const TL = gsap.timeline({
        paused: true,
      });

      TL.to(element,{
          opacity: 1,
          y: 0,
          duration: durationNum,
          ease: "powe1.out",
          delay: delayNum * i,
          stagger: {
            amount: delayNum,
            from: 'start'
          }
      })
      this._createScrollTrigger(element, TL);
    })
  }

  fadeDown() {
    this.elements = document.querySelectorAll('.js-fadeDown');
    this.elements.forEach((element, i) => {

      //delay
      delayNum = (!element.dataset.delay) ? 0.15 : element.dataset.delay;

      //duration
      durationNum = (!element.dataset.duration) ? 1 : element.dataset.duration;

      //transformY
      yNum = (!element.dataset.y) ? -30 : element.dataset.y;

      gsap.set(element,{
        opacity: 0,
        y: yNum,
      });


      const TL = gsap.timeline({
        paused: true,
      });

      TL.to(element,{
          opacity: 1,
          y: 0,
          duration: durationNum,
          ease: "powe1.out",
          delay: delayNum * i,
          stagger: {
            amount: delayNum,
            from: 'start'
          }
      })
      this._createScrollTrigger(element, TL);
    })
  }

  parallax() {
    const SP = window.innerWidth < 768;
    const transformY = SP ? 20 : 100;
    const elements = document.querySelectorAll('.js-pallax');
    elements.forEach((element) => {
      gsap.fromTo(element.querySelector('img'), {
        y: 0,
        scale: 1.15,
      }, {
        y: transformY,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom top",
          scrub: 1,
          //  markers: true,
        }
      })
    })
  }

  mvAnim() {
    const PARTS_01 = document.querySelector('.mv__parts.-img01');
    const PARTS_02 = document.querySelector('.mv__parts.-img02');
    const PARTS_03 = document.querySelector('.mv__parts.-img03');
    const PARTS_04 = document.querySelector('.mv__parts.-img04');

    const elements = document.querySelectorAll('.mv__parts');

    elements.forEach(element => {
      const TL = gsap.timeline({
        paused: true,
      });

      gsap.set([PARTS_01, PARTS_02, PARTS_03],{
        y: -30
      });

      gsap.set([PARTS_01, PARTS_02, PARTS_03, PARTS_04],{
        opacity: 0,
        ease: "powe1.out",
        duration: .5,
      });

      TL.to(PARTS_01,{
          opacity: 1,
          y: 0,
      })
      .to(PARTS_02,{
          opacity: 1,
          y: 0,
      })
      .to(PARTS_03,{
          opacity: 1,
          y: 0,
      })
      .to(PARTS_04,{
          opacity: 1,
      })
      this._createScrollTrigger(element, TL);
    })

  }


}