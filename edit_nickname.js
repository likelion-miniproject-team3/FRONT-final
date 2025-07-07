document.addEventListener('DOMContentLoaded', async function () {
  // 프로필 정보 표시
  try {
    const res = await fetch('/api/users/me/profile');
    if (!res.ok) throw new Error();
    const userInfo = await res.json();

    document.getElementById('nicknameDisplay').innerText =
      userInfo.usernickname || '';
    document.getElementById('studentNumberDisplay').innerText =
      userInfo.usernumber || '';
    document.getElementById('emailDisplay').innerText =
      userInfo.useremail || '';

    // 사진도 있으면 보여주기
    const profileImg = document.querySelector('.profile-img');
    if (profileImg && userInfo.profileImageUrl) {
      profileImg.style.backgroundImage = `url(${userInfo.profileImageUrl})`;
      profileImg.style.backgroundSize = 'cover';
    }
  } catch (e) {
    console.error('프로필 API 오류:', e);
  }

  // 닉네임 저장
  const saveBtn = document.querySelector('.save-button');
  if (saveBtn) {
    saveBtn.addEventListener('click', async function () {
      const updatedNickname = document.getElementById('nickname').value;

      try {
        const res = await fetch('/api/users/me/profile/nickname', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernickname: updatedNickname }),
        });
        if (!res.ok) throw new Error();
        alert('닉네임이 성공적으로 수정되었습니다!');
        location.reload();
      } catch (e) {
        alert('닉네임 저장 중 오류가 발생했습니다.');
        console.error(e);
      }
    });
  }

  // 사진 변경
  const cameraBtn = document.querySelector('.camera-btn');
  const uploadOptions = document.getElementById('uploadOptions');

  if (cameraBtn && uploadOptions) {
    cameraBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      uploadOptions.classList.toggle('hidden');
    });

    document.addEventListener('click', function (e) {
      if (!uploadOptions.contains(e.target) && !cameraBtn.contains(e.target)) {
        uploadOptions.classList.add('hidden');
      }
    });
  }

  // 업로드용 input
  const galleryInput = document.createElement('input');
  galleryInput.type = 'file';
  galleryInput.accept = 'image/*';
  galleryInput.style.display = 'none';
  document.body.appendChild(galleryInput);

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  const galleryOption = document.querySelector('#uploadOptions li:first-child');
  const fileOption = document.querySelector('#uploadOptions li:last-child');

  async function uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await fetch('/api/users/me/profile/picture', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error();
      alert('프로필 사진이 업로드되었습니다!');
      location.reload();
    } catch (e) {
      alert('프로필 사진 업로드 실패');
      console.error(e);
    }
  }

  if (galleryOption) {
    galleryOption.addEventListener('click', () => {
      galleryInput.click();
    });
  }
  if (fileOption) {
    fileOption.addEventListener('click', () => {
      fileInput.click();
    });
  }

  galleryInput.addEventListener('change', function () {
    if (galleryInput.files[0]) {
      uploadProfilePicture(galleryInput.files[0]);
    }
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files[0]) {
      uploadProfilePicture(fileInput.files[0]);
    }
  });

  // 홈 버튼 클릭 시 진로에 맞게
  const homeBtn = document.querySelector('a[href="home.html"]');
  if (homeBtn) {
    homeBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      try {
        const res = await fetch('/api/users/me/profile');
        if (!res.ok) throw new Error();
        const userInfo = await res.json();
        const field = userInfo.field;

        let targetPage = 'home.html';
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
        window.location.href = 'home.html';
      }
    });
  }
});
