document.addEventListener('DOMContentLoaded', () => {
  const useridInput = document.getElementById('userid');
  const passwordInput = document.getElementById('password');
  const labelUserid = document.querySelector("label[for='userid']");
  const labelPassword = document.querySelector("label[for='password']");
  const useridError = document.getElementById('userid-error');
  const passwordError = document.getElementById('password-error');
  const toggleBtn = document.getElementById('togglePassword');

  // 기존 활성화 함수 유지 (포커스/입력 색 변경)
  function toggleActive(input, label) {
    if (input.value.trim() !== '' || document.activeElement === input) {
      input.classList.add('active');
      label.classList.add('active');
    } else {
      input.classList.remove('active');
      label.classList.remove('active');
    }
  }

  // 에러 상태 설정 함수
  function setError(input, label, errorElem, message) {
    if (message) {
      input.classList.add('error');
      label.classList.add('error');
      errorElem.textContent = message;
      errorElem.classList.add('active');
    } else {
      input.classList.remove('error');
      label.classList.remove('error');
      errorElem.textContent = '';
      errorElem.classList.remove('active');
    }
  }

  // 입력 중엔 에러 해제 + 활성화 상태 토글
  function handleInput(input, label, errorElem) {
    toggleActive(input, label);
    setError(input, label, errorElem, '');
  }

  // 검증 함수 (빈 값 체크)
  function validate() {
    let valid = true;

    if (useridInput.value.trim() === '') {
      setError(
        useridInput,
        labelUserid,
        useridError,
        '아이디를 다시 확인해주세요'
      );
      valid = false;
    } else {
      setError(useridInput, labelUserid, useridError, '');
    }

    if (passwordInput.value.trim() === '') {
      setError(
        passwordInput,
        labelPassword,
        passwordError,
        '비밀번호를 다시 확인해주세요'
      );
      valid = false;
    } else {
      setError(passwordInput, labelPassword, passwordError, '');
    }

    return valid;
  }

  // 이벤트 등록
  [useridInput, passwordInput].forEach((input) => {
    const label = input.id === 'userid' ? labelUserid : labelPassword;
    const errorElem = input.id === 'userid' ? useridError : passwordError;

    input.addEventListener('input', () => handleInput(input, label, errorElem));
    input.addEventListener('focus', () => toggleActive(input, label));
    input.addEventListener('blur', () => toggleActive(input, label));
  });

  // 로그인 버튼 검증 및 처리
  const loginBtn = document.querySelector('.bottom-area button');
  // 로그인 버튼 클릭 시 처리
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (validate()) {
      const userid = useridInput.value.trim();
      const password = passwordInput.value.trim();

      const storedUser = JSON.parse(localStorage.getItem('userInfo'));

      if (!storedUser) {
        // 저장된 정보가 없는 경우 (회원가입 안 했을 때)
        setError(
          useridInput,
          labelUserid,
          useridError,
          '가입된 정보가 없습니다'
        );
        return;
      }

      if (storedUser.userid !== userid) {
        setError(
          useridInput,
          labelUserid,
          useridError,
          '존재하지 않는 아이디입니다'
        );
        return;
      }

      if (storedUser.password !== password) {
        setError(
          passwordInput,
          labelPassword,
          passwordError,
          '비밀번호가 일치하지 않습니다'
        );
        return;
      }

      let redirectPage = 'home.html';

      switch (storedUser.field) {
        case '대학원 진학형':
          redirectPage = 'daehakwon.html';
          break;
        case '빅데이터 분야':
          redirectPage = 'bigdata.html';
          break;
        case 'AI/클라우드 분야':
          redirectPage = 'ai.html';
          break;
        case '마이크로 전공형':
          redirectPage = 'micro.html';
          break;
      }

      window.location.href = redirectPage;
    }
  });
});
