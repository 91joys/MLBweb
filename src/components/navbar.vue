<template>
  <div class="parent">
    <div class="nav-container">
      <div class="nav-item featured">所有球員</div>
      <div class="separator"></div>
      <div class="nav-item">投手</div>
      <div class="nav-item">捕手</div>
      <div class="nav-item">內野手</div>
      <div class="nav-item">外野手</div>
    </div>
    <div class="ai-button-container">
      <div class="ai-button">
        <img class="ai-icon" alt="" src="@/assets/images/chat.svg" />
        <b class="ai-text">Q.AI</b>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  text-align: center;
  font-size: 36px;
  color: #fff;
  font-family: "Noto Sans TC";
  position: relative;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 3rem;
  justify-content: center;
}

.nav-item {
  font-weight: 300;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.nav-item.featured {
  font-size: 64px;
  font-weight: 900;
}

.separator {
  border-right: 1px solid #fff;
  height: 45px;
  margin: 0 1rem;
}

.ai-button-container {
  position: relative;
}

.ai-button {
  position: relative;
  width: 193px;
  height: 76px;
  box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 38px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.ai-button:hover {
  transform: translateY(-2px);
}

.ai-icon {
  width: 46px;
  height: 46px;
  max-width: 100%;
  max-height: 100%;
}

.ai-text {
  font-size: 32px;
  color: #005596;
  font-family: "Century Gothic";
}

/* 響應式調整 */
@media (max-width: 1200px) {
  .nav-container {
    gap: 2rem;
  }

  .nav-item.featured {
    font-size: 48px;
  }

  .parent {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .parent {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
  }

  .nav-container {
    gap: 1rem;
    flex-wrap: wrap;
  }

  .nav-item.featured {
    font-size: 36px;
  }

  .parent {
    font-size: 24px;
  }

  .ai-button {
    width: 150px;
    height: 60px;
  }

  .ai-text {
    font-size: 24px;
  }

  .ai-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
