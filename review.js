document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const subjectButtons = document.getElementById('subject-buttons');
  const gradeButtons = document.querySelectorAll('.grade-btn');
  const searchBar = document.querySelector('.search-bar');
  const gradeButtonGroup = document.querySelector('.grade-button-group');
  const textHeading = document.querySelector('.text');
  const reviewDetail = document.getElementById('review-detail');
  const backButton = document.getElementById('back-button');
  const writeForm = document.getElementById('write-form');
  const textarea = document.querySelector('#write-form textarea');
  const submitBtn = document.getElementById('submit-review');
  const savedReviews = JSON.parse(
    localStorage.getItem('lectureReviews') || '[]'
  );
  const reviewContainer = document.querySelector('.lecture-reviews');
  const examTypeSelect = document.getElementById('exam-type-selected');
  const examTypeText = document.getElementById('exam-type-selected-text');
  const examTypeOptions = document.getElementById('exam-type-options');
  const examTypeArrow = document.getElementById('exam-type-arrow');
  const uploadButton = document.getElementById('upload-button');
  const uploadOptions = document.getElementById('upload-options');
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('fileInput');
  let filePath = '';
  const savedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
  const nickname = savedUserInfo?.usernickname || '익명';

  savedReviews.forEach((review) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
    <div class="review-stars">⭐ ${review.stars}점</div>
    <div class="review-semester">${review.semester}</div>
    <div class="review-content">${review.content}</div>
  `;
    reviewContainer.appendChild(card);
  });

  // 배경 제거 (디자인용)
  reviewContainer.style.backgroundColor = 'transparent';

  const subjects = {
    '1학년': [
      '데이터 분석 기초',
      '인공지능 개론',
      '객체지향 프로그램',
      '미적분학',
    ],
    '2학년': [
      '프로그래밍 기초',
      '통계 기초',
      '인공지능 수학',
      'SW/HW 플랫폼 설계',
      '통계실무',
      '인공지능 프로그램',
      '운영체제',
      '데이터 사이언스',
      '빅데이터 처리',
    ],
    '3학년': [
      '인공지능 플랫폼 설계',
      '데이터 마이닝 및 응용 실습',
      '소프트웨어 공학',
      '클라우드 컴퓨팅',
      'AI 정보보안',
      '딥러닝',
      '정밀의료',
      '멀티모달 학습',
      '의료 DB 설계',
      '자료구조',
      '데이터 모델 및 시각화',
      '자동화 이론',
      '알고리즘 분석',
      '의료 전문가 시스템',
    ],
    '4학년': ['의사결정 지원 시스템', 'BM 프로젝트', '졸업논문'],
  };

  const subjectDetails = {
    '데이터 분석 기초': '1학기 · 필수',
    '인공지능 개론': '1학기 · 필수',
    '객체지향 프로그램': '1학기 · 필수',
    미적분학: '1학기 · 필수',
    '프로그래밍 기초': '1학기 · 필수',
    '통계 기초': '1학기 · 필수',
    '인공지능 수학': '1학기 · 필수',
    'SW/HW 플랫폼 설계': '2학기 · 필수',
    통계실무: '2학기 · 필수',
    '인공지능 프로그램': '2학기 · 필수',
    운영체제: '1학기 · 선택',
    '데이터 사이언스': '1학기 · 선택',
    '빅데이터 처리': '2학기 · 선택',
    '인공지능 플랫폼 설계': '1학기 · 필수',
    '데이터 마이닝 및 응용 실습': '1학기 · 필수',
    '소프트웨어 공학': '2학기 · 필수',
    '클라우드 컴퓨팅': '1학기 · 선택',
    'AI 정보보안': '1학기 · 선택',
    딥러닝: '1학기 · 선택',
    정밀의료: '1학기 · 선택',
    '멀티모달 학습': '1학기 · 선택',
    '의료 DB 설계': '1학기 · 선택',
    자료구조: '2학기 · 선택',
    '데이터 모델 및 시각화': '2학기 · 선택',
    '자동화 이론': '2학기 · 선택',
    '알고리즘 분석': '2학기 · 선택',
    '의료 전문가 시스템': '2학기 · 선택',
    '의사결정 지원 시스템': '1학기 · 선택',
    'BM 프로젝트': '2학기 · 선택',
    졸업논문: '2학기 · 선택',
  };

  let currentGrade = '1학년';

  function renderSubjects(list) {
    subjectButtons.innerHTML = list
      .map(
        (name) => `
      <button class="subject-btn">
        <div class="left">
          <div class="profile">
            <svg class="profile-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#fff" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#fff" />
            </svg>
          </div>
          <div class="info">
            <div class="name">${name}</div>
            <div class="detail">${subjectDetails[name] || ''}</div>
          </div>
        </div>
        <div class="arrow">›</div>
      </button>
    `
      )
      .join('');
  }

  renderSubjects(subjects[currentGrade]);

  // 학년 버튼 누르면 각 학년에 맞게 과목 나오도록 하는 거
  gradeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      gradeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      currentGrade = btn.querySelector('span').textContent;
      searchInput.value = '';
      renderSubjects(subjects[currentGrade]);
    });
  });

  // 검색 기능
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword === '') {
      renderSubjects(subjects[currentGrade]);
    } else {
      const allSubjectNames = Object.keys(subjectDetails);
      const matched = allSubjectNames.filter((name) =>
        name.toLowerCase().includes(keyword)
      );
      renderSubjects(matched);
    }
  });

  // 과목 버튼 누르면 후기 화면으로 전환
  document.addEventListener('click', function (e) {
    const subjectBtn = e.target.closest('.subject-btn');
    if (subjectBtn) {
      const subjectName = subjectBtn.querySelector('.name').textContent;
      document.getElementById('subject-title').textContent = subjectName;

      // document.querySelector('.stars').innerHTML = '☆☆☆☆☆';
      // document.querySelector('.rating-score').innerHTML = '';

      renderRating();
      loadLectureReviews(subjectName);
      loadExamReviews(subjectName); // ← 이거 추가!

      subjectButtons.style.display = 'none';
      searchBar.style.display = 'none';
      gradeButtonGroup.style.display = 'none';
      textHeading.style.display = 'none';
      reviewDetail.style.display = 'block';
    }
  });

  //  뒤로 가기 버튼 : 누르면 다시 과목 검색창으로
  backButton.addEventListener('click', () => {
    reviewDetail.style.display = 'none';

    // ✅ 다시 보여줘야 하는 것들
    subjectButtons.style.display = 'flex';
    searchBar.style.display = 'flex';
    gradeButtonGroup.style.display = 'flex';
    textHeading.style.display = 'block';

    // ✅ 스크롤 맨 위로 (선택 사항)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function renderRating() {
    const subjectName = document.getElementById('subject-title').textContent;
    const saved = JSON.parse(
      localStorage.getItem(`lecture-${subjectName}`) || '[]'
    );

    let average = 0;
    let count = saved.length;

    if (count > 0) {
      const total = saved.reduce((sum, item) => sum + Number(item.stars), 0);
      average = total / count;
    }

    // 별 UI 업데이트
    const starsElem = document.querySelector('.stars');
    const scoreElem = document.querySelector('.rating-score');

    let starHTML = '';
    for (let i = 1; i <= 5; i++) {
      starHTML += i <= Math.round(average) ? '★' : '☆';
    }

    starsElem.innerHTML = starHTML;
    scoreElem.innerHTML = `<strong>${average.toFixed(
      1
    )}</strong><span>(${count})</span>`;
  }

  // 평가하기 버튼 누르면 작성 폼 보여주기
  // 평가하기 버튼 → 작성 폼 보여주기
  document.querySelectorAll('.write-button').forEach((button) => {
    button.addEventListener('click', () => {
      const isExamButton = button.textContent.includes('등록하기');
      const subjectName = document.getElementById('subject-title').textContent;

      reviewDetail.style.display = 'none';
      writeForm.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const dividers = document.querySelectorAll('.divider');
      dividers.forEach((divider) => {
        divider.style.display = isExamButton ? 'none' : 'block';
      });

      document.getElementById('uploaded-images').innerHTML = '';

      // ✅ 기본 초기화
      updateStars(0);
      textarea.value = '';
      selectedText.textContent = isExamButton ? '응시 학기' : '수강 학기';
      selectedText.style.color = '#3b6ef7';
      submitBtn.style.backgroundColor = '#f7f8fc';
      submitBtn.style.color = '#3b6ef7';

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const nickname = userInfo?.usernickname?.trim() || '익명';

      if (isExamButton) {
        // ✅ 시험 정보 등록 모드
        document.getElementById('write-form-title').textContent =
          '시험 정보 등록하기';
        document.getElementById('semester-label').textContent =
          '응시한 학기를 선택해 주세요.';
        document.getElementById('exam-type-select').style.display = 'block';
        document.querySelector('.write-rating').style.display = 'none';
        document.querySelector('.divider').style.display = 'none';
        uploadArea.style.display = 'inline-block';
        textarea.style.marginTop = '-20px';
        textarea.placeholder = '예시) 시험꿀팁, 주의사항, 문제유형 등';
        textarea.classList.add('exam-placeholder');
        examTypeText.textContent = '응시 회차';
        examTypeText.style.color = '#3b6ef7';
        examTypeOptions.style.display = 'none';
        examTypeArrow.classList.remove('rotate');

        // ✅ 기존 시험 정보 불러오기
        const examKey = `exam-${subjectName}`;
        const examList = JSON.parse(localStorage.getItem(examKey) || '[]');
        const existingExam = examList.find(
          (exam) => exam.nickname === nickname
        );

        if (existingExam) {
          textarea.value = existingExam.content;
          selectedText.textContent = existingExam.semester;
          selectedText.style.color = '#3b6ef7';
          examTypeText.textContent = existingExam.type;
          examTypeText.style.color = '#3b6ef7';

          // 파일 표시
          if (existingExam.filePath) {
            const container = document.getElementById('uploaded-images');
            const fileBox = document.createElement('div');
            fileBox.className = 'uploaded-image';
            const fileIcon = document.createElement('div');
            fileIcon.textContent = '📄';
            const fileName = document.createElement('div');
            fileName.textContent = '첨부 파일';
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-image';
            removeBtn.textContent = '✕';
            removeBtn.onclick = () => {
              fileBox.remove();
              filePath = ''; // ✅ 이 줄 추가해야 삭제한 파일이 localStorage에 반영됨
            };

            fileBox.append(fileIcon, fileName, removeBtn);
            container.appendChild(fileBox);
            filePath = existingExam.filePath;
          }

          writeForm.dataset.editMode = 'true';
        } else {
          textarea.value = '';
          selectedText.textContent = '응시 학기';
          selectedText.style.color = '#3b6ef7';
          examTypeText.textContent = '응시 회차';
          examTypeText.style.color = '#3b6ef7';
          filePath = '';
          writeForm.dataset.editMode = 'false';
        }
      } else {
        // ✅ 강의평 작성 모드
        document.getElementById('write-form-title').textContent =
          '강의평 작성하기';
        document.getElementById('semester-label').textContent =
          '수강한 학기를 선택해 주세요.';
        document.getElementById('exam-type-select').style.display = 'none';
        document.querySelector('.write-rating').style.display = 'flex';
        document.querySelector('.divider').style.display = 'block';
        uploadArea.style.display = 'none';
        textarea.style.marginTop = '-20px';
        textarea.placeholder = '이 강의에 대한 평가를 작성해 주세요.';
        textarea.classList.remove('exam-placeholder');

        // ✅ 기존 강의평 불러오기
        const reviewKey = `lecture-${subjectName}`;
        const reviews = JSON.parse(localStorage.getItem(reviewKey) || '[]');
        const existingReview = reviews.find((r) => r.nickname === nickname);

        if (existingReview) {
          updateStars(parseInt(existingReview.stars));
          textarea.value = existingReview.content;
          selectedText.textContent = existingReview.semester;
          selectedText.style.color = '#3b6ef7';
          writeForm.dataset.editMode = 'true';
        } else {
          updateStars(0);
          textarea.value = '';
          selectedText.textContent = '수강 학기';
          selectedText.style.color = '#3b6ef7';
          writeForm.dataset.editMode = 'false';
        }
      }
    });
  });

  // 돌아가기 버튼 → 기존 상세 화면으로
  document.getElementById('write-back-button').addEventListener('click', () => {
    writeForm.style.display = 'none';
    reviewDetail.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 별점 클릭 처리
  const stars = document.querySelectorAll('.write-stars span');
  const scoreDisplay = document.querySelector('.write-score');

  updateStars(0);

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-value'));
      updateStars(rating);
    });
  });

  let currentRating = 0;

  function updateStars(rating) {
    stars.forEach((star) => {
      const value = parseInt(star.getAttribute('data-value'));
      if (value <= rating) {
        star.classList.add('active');
        star.textContent = '★';
      } else {
        star.classList.remove('active');
        star.textContent = '☆';
      }
    });

    scoreDisplay.textContent = `${rating}/5`;
  }
  const selected = document.getElementById('selected');
  const selectedText = document.getElementById('selected-text');
  const options = document.getElementById('options');

  // 토글 드롭다운 열기/닫기
  selected.addEventListener('click', () => {
    const isOpen = options.style.display === 'block';
    options.style.display = isOpen ? 'none' : 'block';

    // 화살표 회전
    dropdownArrow.classList.toggle('rotate', !isOpen);
  });

  // 항목 클릭 시 선택
  options.querySelectorAll('li').forEach((li) => {
    li.addEventListener('click', () => {
      selectedText.textContent = li.textContent;
      selectedText.style.color = '#3b6ef7'; // 선택된 값도 파란색 유지
      options.style.display = 'none';

      dropdownArrow.classList.remove('rotate');
    });
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!document.getElementById('custom-select').contains(e.target)) {
      options.style.display = 'none';
      dropdownArrow.classList.remove('rotate');
    }
  });

  textarea.addEventListener('input', () => {
    const isExamMode =
      document.getElementById('write-form-title').textContent ===
      '시험 정보 등록하기';

    if (textarea.value.length > 20) {
      submitBtn.style.backgroundColor = '#3b6ef7'; // 파란색 배경
      submitBtn.style.color = 'white'; // 흰색 글자

      if (isExamMode) {
        submitBtn.textContent = '등록하기'; // ← 텍스트 변경
      } else {
        submitBtn.textContent = '작성하기';
      }
    } else {
      submitBtn.style.backgroundColor = '#f7f8fc'; // 원래 배경색
      submitBtn.style.color = '#3b6ef7'; // 원래 글자색
      submitBtn.textContent = '작성하기'; // 20자 이하일 땐 작성하기로 고정
    }
  });

  const currentPage = window.location.pathname.split('/').pop();

  // ✅ 맨 아래에 이 코드 추가 (또는 기존 홈 버튼 처리 부분 바꾸기)
  document.querySelectorAll('.bottom-nav .nav-item').forEach((item) => {
    const href = item.getAttribute('href');

    if (href === currentPage) {
      item.classList.add('active');
    }

    // 홈 버튼 클릭 시 희망 분야에 따라 이동
    if (href === 'home.html') {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const field = userInfo?.field;

        let targetPage = 'home.html'; // 기본값

        switch (field) {
          case '대학원 진학형':
            targetPage = 'daehakwon.html';
            break;
          case '빅데이터 분야':
            targetPage = 'bigdata.html';
            break;
          case 'AI/클라우드 분야':
            targetPage = 'ai.html';
            break;
          case '마이크로 전공형':
            targetPage = 'micro.html';
            break;
        }

        window.location.href = targetPage;
      });
    }
  });

  // 컨테이너 생기도록
  submitBtn.addEventListener('click', function () {
    const isExamMode =
      document.getElementById('write-form-title').textContent ===
      '시험 정보 등록하기';

    const content = textarea.value.trim();
    const selectedSemester = selectedText.textContent.trim();
    const selectedExamType = examTypeText.textContent.trim();
    const subjectName = document.getElementById('subject-title').textContent;
    const selectedStars = parseInt(scoreDisplay.textContent);
    const semester = selectedSemester;
    const examType = selectedExamType;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const nickname = userInfo?.usernickname?.trim() || '익명';

    const isEdit = writeForm.dataset.editMode === 'true';

    if (isExamMode) {
      if (semester === '응시 학기') {
        showCustomAlert('응시 학기를 선택해주세요.');
        return;
      }
      if (examType === '응시 회차') {
        showCustomAlert('응시 회차를 선택해주세요.');
        return;
      }
      if (content === '') {
        showCustomAlert('시험 정보를 입력해주세요.');
        return;
      }
      if (content.length < 20) {
        showCustomAlert('시험 정보를 더 자세히 작성해주세요.');
        return;
      }

      const examKey = `exam-${subjectName}`;
      const savedExams = JSON.parse(localStorage.getItem(examKey) || '[]');

      if (isEdit) {
        const target = savedExams.find((e) => e.nickname === nickname);
        if (target) {
          target.semester = semester;
          target.type = examType;
          target.content = content;
          target.filePath = filePath && filePath !== '' ? filePath : '';
        }

        const allExamCards = document.querySelectorAll(
          '.exam-reviews .review-card'
        );
        for (const card of allExamCards) {
          const nicknameElem = card.querySelector('.nickname');
          if (nicknameElem && nicknameElem.textContent === nickname) {
            card.querySelector(
              '.exam-subinfo'
            ).textContent = `${semester} · ${examType}`;
            card.querySelector('.review-content').textContent = content;

            const download = card.querySelector('.download-link');
            if (filePath) {
              if (!download) {
                const newDownload = document.createElement('a');
                newDownload.className = 'download-link';
                newDownload.href = filePath;
                newDownload.download = '';
                newDownload.onclick = () =>
                  showCustomAlert('자료가 저장되었습니다.');
                newDownload.innerHTML = `자료 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b6ef7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; vertical-align: middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>`;
                card.querySelector('.review-header').appendChild(newDownload);
              } else {
                download.href = filePath;
              }
            } else {
              if (download) download.remove();
            }
          }
        }
      } else {
        const newExam = document.createElement('div');
        newExam.className = 'review-card exam';

        newExam.innerHTML = `
        <div class="review-header">
          <div class="profile-img">
            ${
              userInfo?.profileImage
                ? `<img src="${userInfo.profileImage}" alt="profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
                : `<svg xmlns="http://www.w3.org/2000/svg" class="default-profile-icon" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>`
            }
          </div>
          <div class="review-meta">
            <strong class="nickname">${nickname}</strong>
            <div class="exam-subinfo">${semester} · ${examType}</div>
          </div>
          ${
            filePath
              ? `<a href="${filePath}" download class="download-link" onclick="showCustomAlert('자료가 저장되었습니다.')">
            자료
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b6ef7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; vertical-align: middle;">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>`
              : ''
          }
        </div>
        <div class="review-content">${content}</div>`;

        document.querySelector('.exam-reviews').appendChild(newExam);
        savedExams.push({
          semester,
          type: examType,
          content,
          nickname,
          filePath: filePath || '',
        });
      }

      localStorage.setItem(examKey, JSON.stringify(savedExams));

      textarea.value = '';
      selectedText.textContent = '응시 학기';
      selectedText.style.color = '#3b6ef7';
      examTypeText.textContent = '응시 회차';
      examTypeText.style.color = '#3b6ef7';
      document.getElementById('uploaded-images').innerHTML = '';
      filePath = '';

      writeForm.style.display = 'none';
      reviewDetail.style.display = 'block';
      renderRating();
      loadExamReviews(subjectName);
      return;
    }

    // 강의평 처리 (별점/학기/내용 검증)
    if (isNaN(selectedStars) || selectedStars === 0) {
      showCustomAlert('강의의 별점을 매겨주세요.');
      return;
    }
    if (semester === '수강 학기') {
      showCustomAlert('수강 학기를 선택해주세요.');
      return;
    }
    if (content === '') {
      showCustomAlert('강의평을 작성해주세요.');
      return;
    }
    if (content.length < 20) {
      showCustomAlert('강의평을 더 자세히 작성해주세요.');
      return;
    }

    const reviewKey = `lecture-${subjectName}`;
    const saved = JSON.parse(localStorage.getItem(reviewKey) || '[]');

    if (isEdit) {
      const target = saved.find((r) => r.nickname === nickname);
      if (target) {
        target.stars = selectedStars;
        target.semester = semester;
        target.content = content;
      }

      const allCards = document.querySelectorAll(
        '.lecture-reviews .review-card'
      );
      for (const card of allCards) {
        const nicknameElem = card.querySelector('.nickname');
        if (nicknameElem && nicknameElem.textContent === nickname) {
          card.querySelector('.semester').textContent = semester;
          card.querySelector('.review-content').textContent = content;
          card.querySelector('.review-stars').innerHTML =
            getStarHTML(selectedStars);
        }
      }
    } else {
      const newReview = document.createElement('div');
      newReview.className = 'review-card';
      const stars = getStarHTML(selectedStars);

      newReview.innerHTML = `
      <div class="review-header">
        <div class="left-section">
          <div class="profile-img">
            ${
              userInfo?.profileImage
                ? `<img src="${userInfo.profileImage}" alt="profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
                : `<svg xmlns="http://www.w3.org/2000/svg" class="default-profile-icon" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>`
            }
          </div>
          <div class="info">
            <div class="nickname">${nickname}</div>
            <div class="semester small-gray">${semester}</div>
          </div>
        </div>
        <div class="review-stars">${stars}</div>
      </div>
      <div class="review-content">${content}</div>
    `;
      document.querySelector('.lecture-reviews').appendChild(newReview);

      saved.push({ semester, stars: selectedStars, content, nickname });
    }

    localStorage.setItem(reviewKey, JSON.stringify(saved));

    textarea.value = '';
    selectedText.textContent = '수강 학기';
    selectedText.style.color = '#3b6ef7';
    renderRating();
    updateStars(0);
    writeForm.style.display = 'none';
    reviewDetail.style.display = 'block';
  });

  examTypeSelect.addEventListener('click', () => {
    const isOpen = examTypeOptions.style.display === 'block';
    examTypeOptions.style.display = isOpen ? 'none' : 'block';
    examTypeArrow.classList.toggle('rotate', !isOpen);
  });

  examTypeOptions.querySelectorAll('li').forEach((li) => {
    li.addEventListener('click', () => {
      examTypeText.textContent = li.textContent;
      examTypeText.style.color = '#3b6ef7';
      examTypeOptions.style.display = 'none';
      examTypeArrow.classList.remove('rotate');
    });
  });

  document.addEventListener('click', (e) => {
    if (!examTypeSelect.contains(e.target)) {
      examTypeOptions.style.display = 'none';
      examTypeArrow.classList.remove('rotate');
    }
  });
  function loadExamReviews(subjectName) {
    const examList =
      JSON.parse(localStorage.getItem(`exam-${subjectName}`)) || [];
    const container = document.querySelector('.exam-reviews');
    container.innerHTML = '';

    examList.forEach((item) => {
      const box = document.createElement('div');
      box.className = 'review-card';

      box.innerHTML = `
  <div class="review-header">
    <div class="profile-img"></div>
    <div class="review-meta">
      <strong class="nickname">${item.nickname || '익명'}</strong>
      <div class="exam-subinfo">${item.semester} · ${item.type}</div>
    </div>
    ${
      item.filePath
        ? `<a href="${item.filePath}" download class="download-link show-alert">
            자료
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b6ef7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; vertical-align: middle;">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>`
        : ''
    }
  </div>
  <div class="review-content">${item.content}</div>
`;

      container.appendChild(box);
    });
  }

  function loadLectureReviews(subjectName) {
    const reviewKey = `lecture-${subjectName}`;
    const reviews = JSON.parse(localStorage.getItem(reviewKey) || '[]');
    const container = document.querySelector('.lecture-reviews');
    container.innerHTML = '';

    reviews.forEach((review) => {
      const card = document.createElement('div');
      card.className = 'review-card';

      const stars = getStarHTML(review.stars);

      card.innerHTML = `
      <div class="review-header">
        <div class="profile-img"></div>
        <div class="review-info">
          <div class="nickname">${review.nickname || '익명'}</div>
          <div class="semester small-gray">${review.semester}</div>
        </div>
        <div class="review-stars">${stars}</div>
      </div>
      <div class="review-content">${review.content}</div>
    `;

      // ✅ 여기에서 프로필 이미지 삽입
      const profileDiv = card.querySelector('.profile-img');
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (userInfo?.profileImage && userInfo.profileImage !== '') {
        const img = document.createElement('img');
        img.src = userInfo.profileImage;
        img.alt = 'profile';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        profileDiv.appendChild(img);
      } else {
        profileDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="default-profile-icon" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      `;
      }

      container.appendChild(card);
    });
  }
  function loadExamReviews(subjectName) {
    const examList =
      JSON.parse(localStorage.getItem(`exam-${subjectName}`)) || [];
    const container = document.querySelector('.exam-reviews');
    container.innerHTML = '';

    examList.forEach((item) => {
      const box = document.createElement('div');
      box.className = 'review-card';

      box.innerHTML = `
      <div class="review-header">
        <div class="profile-img"></div>
        <div class="review-meta">
          <strong class="nickname">${item.nickname || '익명'}</strong>
          <div class="exam-subinfo">${item.semester} · ${item.type}</div>
        </div>
        ${
          item.filePath
            ? `<a href="${item.filePath}" download class="download-link show-alert">
                자료
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b6ef7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; vertical-align: middle;">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>`
            : ''
        }
      </div>
      <div class="review-content">${item.content}</div>
    `;

      // ✅ 여기서 프로필 이미지 넣기
      const profileDiv = box.querySelector('.profile-img');
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (userInfo?.profileImage && userInfo.profileImage !== '') {
        const img = document.createElement('img');
        img.src = userInfo.profileImage;
        img.alt = 'profile';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        profileDiv.appendChild(img);
      } else {
        profileDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="default-profile-icon" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      `;
      }

      container.appendChild(box);
    });
  }

  function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    const alertOkBtn = document.getElementById('custom-alert-ok');

    alertMessage.textContent = message;
    alertBox.style.display = 'flex';

    alertOkBtn.onclick = () => {
      alertBox.style.display = 'none';
    };
  }

  uploadButton.addEventListener('click', () => {
    uploadOptions.classList.toggle('hidden');
  });

  // 사진 보관함
  document.getElementById('upload-photo').addEventListener('click', () => {
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = 'image/*';
    uploadInput.multiple = true;
    uploadInput.style.display = 'none';
    document.body.appendChild(uploadInput);

    uploadInput.addEventListener('change', () => {
      const container = document.getElementById('uploaded-images');
      Array.from(uploadInput.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageBox = document.createElement('div');
          imageBox.className = 'uploaded-image';

          const img = document.createElement('img');
          img.src = e.target.result;

          filePath = e.target.result;

          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-image';
          removeBtn.textContent = '✕';
          removeBtn.onclick = () => imageBox.remove();

          imageBox.appendChild(img);
          imageBox.appendChild(removeBtn);
          container.appendChild(imageBox);
        };
        reader.readAsDataURL(file);
      });
      uploadInput.remove(); // 메모리 누수 방지
    });

    uploadInput.click();
    uploadOptions.classList.add('hidden');
  });

  // 일반 파일 선택
  document.getElementById('upload-file').addEventListener('click', () => {
    fileInput.accept = '*/*';
    fileInput.click();
    uploadOptions.classList.add('hidden');
  });

  // 파일 선택 후 처리
  fileInput.addEventListener('change', (e) => {
    const container = document.getElementById('uploaded-images');
    container.innerHTML = ''; // ✅ 기존 내용 초기화 (하나만 선택 가능하도록)

    const file = e.target.files[0];
    if (file) {
      filePath = URL.createObjectURL(file);
      console.log('파일 첨부됨:', filePath);

      const fileBox = document.createElement('div');
      fileBox.className = 'uploaded-image';

      const fileIcon = document.createElement('div');
      fileIcon.textContent = '📄';
      fileIcon.style.fontSize = '24px';
      fileIcon.style.marginBottom = '4px';

      const fileName = document.createElement('div');
      fileName.textContent = file.name;
      fileName.style.fontSize = '11px';
      fileName.style.textAlign = 'center';
      fileName.style.wordBreak = 'break-all';

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-image';
      removeBtn.textContent = '✕';
      removeBtn.onclick = () => {
        fileBox.remove();
        filePath = ''; // ✅ 파일 삭제 시 filePath도 비움
      };

      fileBox.appendChild(fileIcon);
      fileBox.appendChild(fileName);
      fileBox.appendChild(removeBtn);
      container.appendChild(fileBox);
    }
  });

  // fileInput.addEventListener('change', function (e) {
  //   const file = e.target.files[0];
  //   if (file) {
  //     filePath = URL.createObjectURL(file); // ✅ 전역변수 filePath에 저장
  //     console.log('파일 첨부됨:', filePath);
  //   }
  // });

  function getStarHTML(score) {
    const full = Math.round(score); // 반올림해서 정수로
    const empty = 5 - full;

    return '★'.repeat(full) + '☆'.repeat(empty);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.show-alert')) {
      setTimeout(() => {
        showCustomAlert('자료가 저장되었습니다.');
      }, 500); // 다운로드 먼저 되게 약간 딜레이
    }
  });
});
