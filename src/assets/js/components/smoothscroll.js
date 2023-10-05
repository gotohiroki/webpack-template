export default class SmoothScroll {
  constructor() {
    const easing = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    const duration = 600;
    let headerHeight = document.querySelector('.o-header').offsetHeight;

    const triggers = document.querySelectorAll('a[href^="#"]');

    triggers.forEach( item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        const href = item.getAttribute('href');
        const targetElement = document.getElementById(href.replace('#', ''));

        if (targetElement) {
          const targetPosition = window.pageYOffset + targetElement.getBoundingClientRect().top - headerHeight;

          const startTime = window.performance.now();

          const loop = nowTime => {
            const time = nowTime - startTime;
            const normalizedTime = time / duration;
            
            if (normalizedTime < 1) {
              // ヘッダーの高さ分を引いてスクロール
              const currentPosition = window.pageYOffset;
              const newPosition = currentPosition + ((targetPosition - currentPosition) * easing(normalizedTime));
              window.scrollTo(0, newPosition);
              window.requestAnimationFrame(loop);
            } else {
              // 最終位置までスクロール
              window.scrollTo(0, targetPosition);
            }
          };

          window.requestAnimationFrame(loop);
        }
      });
    });
  }
}