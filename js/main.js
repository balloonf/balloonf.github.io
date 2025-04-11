// 세원프린팅 메인 자바스크립트 파일

// DOM 요소가 모두 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  // 네비게이션 토글 기능
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
  
  // 스크롤 이벤트 처리
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;
    
    // 스크롤 시 헤더 스타일 변경
    if (scrollPosition > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // 애니메이션 요소 처리
    animateOnScroll();
  });
  
  // 포트폴리오 필터링 기능
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // 활성화된 버튼 클래스 제거
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // 클릭한 버튼 활성화
        this.classList.add('active');
        
        // 필터 카테고리 가져오기
        const filterValue = this.getAttribute('data-filter');
        
        // 포트폴리오 아이템 필터링
        portfolioItems.forEach(item => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
  
  // 견적 계산기 기능
  const calculatorForm = document.getElementById('estimate-form');
  
  if (calculatorForm) {
    calculatorForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // 폼 데이터 수집
      const pageCount = parseInt(document.getElementById('page-count').value);
      const printType = document.getElementById('print-type').value;
      const bindingType = document.getElementById('binding-type').value;
      
      // 기본 가격 설정
      let basePrice = 0;
      
      // 인쇄 유형에 따른 페이지당 가격
      let pricePerPage = 0;
      if (printType === 'bw') {
        pricePerPage = 50; // 흑백 페이지당 50원
      } else if (printType === 'color') {
        pricePerPage = 300; // 컬러 페이지당 300원
      } else if (printType === 'premium') {
        pricePerPage = 500; // 고급 컬러 페이지당 500원
      }
      
      // 인쇄 가격 계산
      let printPrice = pageCount * pricePerPage;
      
      // 제본 유형에 따른 추가 비용
      let bindingPrice = 0;
      if (bindingType === 'staple') {
        bindingPrice = 500; // 스테이플 제본 500원
      } else if (bindingType === 'spiral') {
        bindingPrice = 2000; // 스프링 제본 2000원
      } else if (bindingType === 'hard') {
        bindingPrice = 5000; // 하드커버 제본 5000원
      }
      
      // 총 가격 계산
      const totalPrice = printPrice + bindingPrice;
      
      // 결과 표시
      const resultElement = document.getElementById('estimate-result');
      if (resultElement) {
        resultElement.innerHTML = `
          <div class="estimate-details">
            <p><strong>인쇄비:</strong> ${printPrice.toLocaleString()}원 (${pageCount}장 × ${pricePerPage}원)</p>
            <p><strong>제본비:</strong> ${bindingPrice.toLocaleString()}원</p>
            <p class="estimate-total"><strong>총 견적가:</strong> ${totalPrice.toLocaleString()}원</p>
            <p class="estimate-note">※ 위 금액은 예상 견적이며, 실제 작업 내용에 따라 달라질 수 있습니다.</p>
          </div>
        `;
        resultElement.style.display = 'block';
      }
    });
  }
  
  // 이미지 갤러리 확대 기능
  const galleryImages = document.querySelectorAll('.portfolio-item');
  
  if (galleryImages.length > 0) {
    galleryImages.forEach(item => {
      item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const title = this.querySelector('.portfolio-title').textContent;
        const category = this.querySelector('.portfolio-category').textContent;
        
        // 모달 생성
        const modal = document.createElement('div');
        modal.classList.add('gallery-modal');
        
        modal.innerHTML = `
          <div class="gallery-modal-content">
            <span class="gallery-modal-close">&times;</span>
            <img src="${imgSrc}" alt="${title}">
            <div class="gallery-modal-info">
              <h3>${title}</h3>
              <p>${category}</p>
            </div>
          </div>
        `;
        
        // 모달 추가
        document.body.appendChild(modal);
        
        // 모달 애니메이션
        setTimeout(() => {
          modal.style.opacity = '1';
        }, 10);
        
        // 닫기 버튼 기능
        const closeBtn = modal.querySelector('.gallery-modal-close');
        closeBtn.addEventListener('click', function() {
          modal.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(modal);
          }, 300);
        });
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', function(event) {
          if (event.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
              document.body.removeChild(modal);
            }, 300);
          }
        });
      });
    });
  }
  
  // 문의 폼 유효성 검사
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      const messageInput = document.getElementById('message');
      
      let isValid = true;
      
      // 이름 검사
      if (nameInput.value.trim() === '') {
        showError(nameInput, '이름을 입력해주세요.');
        isValid = false;
      } else {
        removeError(nameInput);
      }
      
      // 이메일 검사
      if (emailInput.value.trim() === '') {
        showError(emailInput, '이메일을 입력해주세요.');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, '유효한 이메일 형식이 아닙니다.');
        isValid = false;
      } else {
        removeError(emailInput);
      }
      
      // 연락처 검사
      if (phoneInput.value.trim() === '') {
        showError(phoneInput, '연락처를 입력해주세요.');
        isValid = false;
      } else {
        removeError(phoneInput);
      }
      
      // 메시지 검사
      if (messageInput.value.trim() === '') {
        showError(messageInput, '문의 내용을 입력해주세요.');
        isValid = false;
      } else {
        removeError(messageInput);
      }
      
      // 폼이 유효하면 처리
      if (isValid) {
        const formMessage = document.createElement('div');
        formMessage.classList.add('form-message', 'success');
        formMessage.textContent = '문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.';
        
        contactForm.innerHTML = '';
        contactForm.appendChild(formMessage);
      }
    });
  }
  
  // 유틸리티 함수
  
  // 스크롤 애니메이션
  function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 50) {
        element.classList.add('animated');
      }
    });
  }
  
  // 이메일 형식 검사
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  // 폼 필드 에러 표시
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    if (!formGroup.querySelector('.error-message')) {
      errorElement.classList.add('error-message');
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    formGroup.classList.add('error');
  }
  
  // 폼 필드 에러 제거
  function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    formGroup.classList.remove('error');
  }
  
  // 초기 스크롤 애니메이션 실행
  animateOnScroll();
});
