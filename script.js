document.addEventListener('DOMContentLoaded', function() {
  // Fade-in effect on page load
  setTimeout(function() {
    document.body.classList.add('page-loaded');
  }, 10);

  var openBtn = document.getElementById('openInviteBtn');
  if (openBtn) {
    openBtn.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.classList.remove('page-loaded');
      document.body.classList.add('fade-out');
      setTimeout(function() {
        window.location.href = openBtn.getAttribute('href');
      }, 1000);
    });
  }

  // Generalize for all internal links (except anchor/hash and external)
  var links = document.querySelectorAll('a[href]');
  links.forEach(function(link) {
    var href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !link.classList.contains('open-invite')
    ) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.remove('page-loaded');
        document.body.classList.add('fade-out');
        setTimeout(function() {
          window.location.href = href;
        }, 1000);
      });
    }
  });

  // Music control logic with sync across pages
  var musicBtn = document.getElementById('musicBtn');
  var bgMusic = document.getElementById('bgMusic');
  var iconPlay = document.getElementById('iconPlay');
  var iconStop = document.getElementById('iconStop');

  function saveMusicState() {
    if (bgMusic) {
      localStorage.setItem('musicTime', bgMusic.currentTime);
      localStorage.setItem('musicPlaying', !bgMusic.paused);
    }
  }

  function restoreMusicState() {
    var savedTime = parseFloat(localStorage.getItem('musicTime'));
    var wasPlaying = localStorage.getItem('musicPlaying') === 'true';
    if (bgMusic && !isNaN(savedTime)) {
      bgMusic.currentTime = savedTime;
    }
    if (bgMusic && wasPlaying) {
      bgMusic.play().then(function() {
        if (iconPlay && iconStop) {
          iconPlay.style.display = 'none';
          iconStop.style.display = 'inline';
        }
      }).catch(function(){});
    } else {
      if (iconPlay && iconStop) {
        iconPlay.style.display = 'inline';
        iconStop.style.display = 'none';
      }
    }
  }

  if (musicBtn && bgMusic && iconPlay && iconStop) {
    var isPlaying = false;
    restoreMusicState();
    musicBtn.addEventListener('click', function() {
      if (bgMusic.paused) {
        bgMusic.play();
        iconPlay.style.display = 'none';
        iconStop.style.display = 'inline';
        isPlaying = true;
      } else {
        bgMusic.pause();
        iconPlay.style.display = 'inline';
        iconStop.style.display = 'none';
        isPlaying = false;
      }
      saveMusicState();
    });
    bgMusic.addEventListener('ended', function() {
      iconPlay.style.display = 'inline';
      iconStop.style.display = 'none';
      isPlaying = false;
      saveMusicState();
    });
    bgMusic.addEventListener('pause', saveMusicState);
    bgMusic.addEventListener('play', saveMusicState);
    bgMusic.addEventListener('timeupdate', function() {
      if (!bgMusic.paused) saveMusicState();
    });
  }

  // Save music state before navigating away
  window.addEventListener('beforeunload', saveMusicState);
});
