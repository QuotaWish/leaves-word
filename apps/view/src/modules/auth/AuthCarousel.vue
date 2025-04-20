<script setup lang="ts">
import AuthScene1 from '/video/auth/scene1.mp4'
import AuthScene2 from '/video/auth/scene2.mp4'
import AuthScene3 from '/video/auth/scene3.mp4'
import AuthScene4 from '/video/auth/scene4.mp4'
import AuthScene5 from '/video/auth/scene5.mp4'

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  video: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: '千叶单词',
    description: '无障碍交流，从一词开始',
    video: AuthScene1,
  },
  {
    id: 2,
    title: '千叶单词',
    description: '旅行无国界，单词即向导',
    video: AuthScene2,
  },
  {
    id: 3,
    title: '千叶单词',
    description: '生命即课堂，万物皆可学',
    video: AuthScene3,
  },
  {
    id: 4,
    title: '千叶单词',
    description: '自信表达，每个场景都是舞台',
    video: AuthScene4,
  },
  {
    id: 5,
    title: '千叶单词',
    description: '碎片成金，成长有迹可循',
    video: AuthScene5,
  },
];

const currentSlide = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);
const autoplayInterval = ref<number | null>(null);

function goToSlide(index: number): void {
  currentSlide.value = index;
}

function nextSlide(): void {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
}

function prevSlide(): void {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
}

function handleTouchStart(event: TouchEvent): void {
  touchStartX.value = event.touches[0].clientX;
}

function handleTouchEnd(event: TouchEvent): void {
  touchEndX.value = event.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe(): void {
  const swipeThreshold = 50;
  const swipeDistance = touchEndX.value - touchStartX.value;

  if (swipeDistance > swipeThreshold) {
    prevSlide();
  } else if (swipeDistance < -swipeThreshold) {
    nextSlide();
  }
}

function startAutoplay(): void {
  autoplayInterval.value = window.setInterval(() => {
    nextSlide();
  }, 5000);
}

function stopAutoplay(): void {
  if (autoplayInterval.value !== null) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
}

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>

<template>
  <div class="auth-carousel" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <div class="carousel-container">
      <div class="carousel-slides" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="slide in slides" :key="slide.id" class="carousel-slide">
          <div class="slide-content">
            <video :src="slide.video" muted autoplay loop :alt="slide.title" class="slide-video" />
            <!-- <video :src="slide.video" muted autoplay loop :alt="slide.title" class="slide-video-blur" /> -->

            <div class="slide-content-inner">
              <h2 class="slide-title">{{ slide.title }}</h2>
              <p class="slide-description">{{ slide.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-indicators">
      <button v-for="(slide, index) in slides" :key="slide.id" class="carousel-indicator"
        :class="{ active: index === currentSlide }" @click="goToSlide(index)"></button>
    </div>

    <div class="carousel-controls">
      <button class="carousel-control prev" @click="prevSlide">&#10094;</button>
      <button class="carousel-control next" @click="nextSlide">&#10095;</button>
    </div>
  </div>
</template>

<style scoped>
.auth-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
}

.carousel-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-slides {
  display: flex;
  transition: transform 0.5s ease;
  height: 100%;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.slide-content {
  text-align: center;
  max-width: 100%;
  position: relative;
}

.slide-content video {
  filter: brightness(0.5) saturate(180%);

  --mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 100%);
  mask-image: var(--mask-image);
}

.slide-content-inner {
  z-index: 10;
  position: absolute;
  top: 10%;
  left: 0;
  right: 0;
  padding: 1rem;
}

.slide-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 1.5rem;
  object-fit: contain;
}

.slide-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #fff;
}

.slide-description {
  font-size: 1rem;
  color: #eee;
  max-width: 80%;
  margin: 0 auto;
}

.carousel-indicators {
  position: absolute;
  top: 10%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.carousel-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  padding: 0;
}

.carousel-indicator.active {
  background-color: #8cc63f;
  /* mbadok 绿色 */
  width: 12px;
  height: 12px;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  padding: 0 1rem;
}

.carousel-control {
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
}

@media (max-width: 768px) {
  .carousel-controls {
    display: none;
  }
}
</style>
