
  function showModal(id) {
    document.getElementById(id).style.display = "block";
  }
  function hideModal(id) {
    document.getElementById(id).classList.remove("fullscreen");
    document.getElementById(id).style.display = "none";
  }
  function toggleFullscreen(elem) {
    const modal = elem.closest('.modal');
    modal.classList.toggle("fullscreen");
  }
  function downloadCV() {
    alert("Downloading CV...");
    window.open(" http://localhost/My%20WEB/Resume/Gaurav Zalavadiya .pdf", "_blank");
   
  }
  function submitForm(event) {
    event.preventDefault();
    document.getElementById("notification").style.display = "block";
    setTimeout(() => {
      document.getElementById("notification").style.display = "none";
    }, 3000);
  }



  function toggleContent(element) {
      const content = element.nextElementSibling;
      const icon = element.querySelector('.toggle-icon');

      if (content.style.display === "block") {
          content.style.display = "none";
          icon.textContent = "➤";
      } else {
          content.style.display = "block";
          icon.textContent = "➤";
      }
  }



  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');

  function toggleChatbot() {
    chatbotWindow.style.display = chatbotWindow.style.display === 'flex' ? 'none' : 'flex';
  }

  function closeChatbot() {
      chatbotWindow.style.display = 'none';
    }

  function sendMessage() {
    const msg = chatInput.value.trim();
    if (msg !== '') {
      const userMsg = document.createElement('div');
      userMsg.textContent = msg;
      userMsg.style.margin = '8px 0';
      userMsg.style.alignSelf = 'flex-end';
      userMsg.style.color = '#fff';
      userMsg.style.padding = '8px 12px';
      userMsg.style.borderRadius = '15px';
      userMsg.style.maxWidth = '80%';
      userMsg.style.textAlign = 'right';

      chatMessages.appendChild(userMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatInput.value = '';
    }
  }

  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  function toggleProfileDropdown() {
    const menu = document.getElementById("profileMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }

  // Close the dropdown if clicking outside
  window.onclick = function(event) {
    if (!event.target.closest('.profile-dropdown')) {
      document.getElementById("profileMenu").style.display = "none";
    }
  }

  function openFlyover(section) {
    document.getElementById("profileMenu").style.display = "none";

    if (section === 'experience') {
      document.getElementById("skillModal").classList.add("show");
    } else if (section === 'education') {
      document.getElementById("aboutModal").classList.add("show");
    }
  }

// Inspect prevent script code 

 /* window.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Detect DevTools (simple way)
  let devtoolsOpen = false;
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function () {
      devtoolsOpen = true;
      throw new Error("DevTools detected");
    }
  });

  setInterval(function () {
    devtoolsOpen = false;
    console.dir(element);
    if (devtoolsOpen) {
      document.body.innerHTML = ""; // Blank the page
    }
  }, 1000);

  // Block common inspect key shortcuts
  document.addEventListener('keydown', function (e) {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
      document.body.innerHTML = ""; // Blank the page
    }
  }); */
  


  