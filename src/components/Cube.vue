<!--
 * @FileDesc: 立方体组件
 -->

<script setup lang="tsx">
import { Image } from "vant"
import { ref } from "vue"

import { toAssetsAbsoluteUrl } from "@/utils"

// export interface ICubeProps {}

// const props = withDefaults(defineProps<ICubeProps>(), {})

// const emits = defineEmits<{
//     /** xxx */
//     (event: "xxx"): void
// }>()

/** REF: 大立方体数据列表 */
const largeCubeFaces = [
    { className: "front", imgSrc: "/image/Cube/cube_img1.jpg" },
    { className: "back", imgSrc: "/image/Cube/cube_img7.jpg" },
    { className: "left", imgSrc: "/image/Cube/cube_img2.jpg" },
    { className: "right", imgSrc: "/image/Cube/cube_img3.jpg" },
    { className: "top", imgSrc: "/image/Cube/cube_img8.jpg" },
    { className: "bottom", imgSrc: "/image/Cube/cube_img11.jpg" }
]

/** REF: 小立方体数据列表 */
const smallCubeFaces = [
    { className: "front", imgSrc: "/image/Cube/cube_img10.jpg" },
    { className: "back", imgSrc: "/image/Cube/cube_img5.jpg" },
    { className: "left", imgSrc: "/image/Cube/cube_img9.jpg" },
    { className: "right", imgSrc: "/image/Cube/cube_img4.jpg" },
    { className: "top", imgSrc: "/image/Cube/cube_img6.jpg" },
    { className: "bottom", imgSrc: "/image/Cube/cube_img12.jpg" }
]

/** REF: 是否激活 */
const isActive = ref(false)
</script>

<template>
    <div class="cube">
        <div class="cube__box" :class="{ 'cube__box--active': isActive }" @click="isActive = !isActive">
            <!-- 大立方体 -->
            <div
                v-for="(face, index) in largeCubeFaces"
                :key="index"
                class="cube__box__max"
                :class="[`cube__box__max__${face.className}`]"
            >
                <Image class="img" :src="toAssetsAbsoluteUrl(face.imgSrc)" fit="contain" />
            </div>

            <!-- 小立方体 -->
            <div
                v-for="(face, index) in smallCubeFaces"
                :key="index"
                class="cube__box__min"
                :class="[`cube__box__min__${face.className}`]"
            >
                <Image class="img" :src="toAssetsAbsoluteUrl(face.imgSrc)" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cube {
    position: relative;
    width: 100%;

    .img {
        width: 100%;
        height: 100%;
    }

    .cube__box {
        width: 50px;
        height: 50px;
        margin: 0 auto;
        transform: rotateX(-30deg) rotateY(-80deg);
        transform-style: preserve-3d;
        animation: rotate linear 20s infinite;

        /* 大正方体样式 */
        &__max {
            position: absolute;
            width: 200px;
            height: 200px;
            opacity: 0.8;
            transition: all 0.4s;

            &__front {
                transform: rotateY(0deg) translateZ(100px);
            }

            &__back {
                transform: translateZ(-100px) rotateY(180deg);
            }

            &__left {
                transform: rotateY(-90deg) translateZ(100px);
            }

            &__right {
                transform: rotateY(90deg) translateZ(100px);
            }

            &__top {
                transform: rotateX(90deg) translateZ(100px);
            }

            &__bottom {
                transform: rotateX(-90deg) translateZ(100px);
            }
        }

        /* 小正方体样式 */
        &__min {
            position: absolute;
            top: 50px;
            left: 50px;
            width: 100px;
            height: 100px;

            &__front {
                transform: rotateY(0deg) translateZ(50px);
            }

            &__back {
                transform: translateZ(-50px) rotateY(180deg);
            }

            &__left {
                transform: rotateY(-90deg) translateZ(50px);
            }

            &__right {
                transform: rotateY(90deg) translateZ(50px);
            }

            &__top {
                transform: rotateX(90deg) translateZ(50px);
            }

            &__bottom {
                transform: rotateX(-90deg) translateZ(50px);
            }
        }

        &--active .cube__box__max__front {
            transform: rotateY(0deg) translateZ(200px);
        }

        &--active .cube__box__max__back {
            transform: translateZ(-200px) rotateY(180deg);
        }

        &--active .cube__box__max__left {
            transform: rotateY(-90deg) translateZ(200px);
        }

        &--active .cube__box__max__right {
            transform: rotateY(90deg) translateZ(200px);
        }

        &--active .cube__box__max__top {
            transform: rotateX(90deg) translateZ(200px);
        }

        &--active .cube__box__max__bottom {
            transform: rotateX(-90deg) translateZ(200px);
        }

        @keyframes rotate {
            from {
                transform: rotateX(0deg) rotateY(0deg);
            }
            to {
                transform: rotateX(360deg) rotateY(360deg);
            }
        }
    }
}
</style>
