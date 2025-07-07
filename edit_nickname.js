document.addEventListener('DOMContentLoaded', function () {
  const saveBtn =
    document.querySelector('.save-button') ||
    document.getElementById('submitNicknameBtn');
  const nicknameInput = document.getElementById('nicknameInput');

  // ✅ userInfo에서 닉네임 꺼내기
  let currentNickname = '현재 닉네임';
  const userInfoRaw = localStorage.getItem('userInfo');
  if (userInfoRaw) {
    try {
      const userInfo = JSON.parse(userInfoRaw);
      currentNickname = userInfo.usernickname || currentNickname;
    } catch (e) {
      console.error('userInfo 파싱 오류:', e);
    }
  }

  // ✅ placeholder에 반영
  if (nicknameInput) {
    nicknameInput.placeholder = currentNickname;
  }

  nicknameInput.addEventListener('input', function () {
    const value = nicknameInput.value.trim();
    if (value.length >= 2 && value.length <= 10) {
      saveBtn.classList.add('active');
    } else {
      saveBtn.classList.remove('active');
    }
  });

  // ✅ 닉네임 저장 버튼 클릭 이벤트
  // ✅ 닉네임 저장 버튼 클릭 이벤트
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      const updatedNickname = nicknameInput.value.trim();

      if (!updatedNickname) {
        alert('닉네임을 입력해주세요.');
        return;
      }

      // ✅ 로컬스토리지에 저장
      localStorage.setItem('usernickname', updatedNickname);

      // ✅ userInfo 안의 닉네임도 업데이트해서 마이페이지 반영되게
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
      userInfo.usernickname = updatedNickname;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      alert(`닉네임이 '${updatedNickname}'(으)로 저장되었습니다!`);

      // ✅ 입력창 초기화 + placeholder 업데이트
      nicknameInput.value = '';
      nicknameInput.placeholder = updatedNickname;
      saveBtn.classList.remove('active');
    });
  }

  // ✅ 홈 버튼 → 고정된 경로로 이동 (필드 정보 없이)
  const homeBtn = document.querySelector('a[href="home.html"]');
  if (homeBtn) {
    homeBtn.addEventListener('click', function (e) {
      e.preventDefault();

      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        const field = userInfo.field;

        let targetPage = 'home.html'; // 기본 홈

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
      } catch (e) {
        console.error('진로 정보 없음:', e);
        window.location.href = 'home.html'; // fallback
      }
    });
  }
});
