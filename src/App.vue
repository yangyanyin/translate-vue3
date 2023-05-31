<template>
  <div class="main">
    <header>
      <img src="./assets/images/google.png" alt="Google 翻译">
      <i>翻译</i>
    </header>
    <textarea class="textarea" @focus="focus" :class="{remind: remind}" v-model="translateText"></textarea>
    <div class="lang">
      <span
        v-for="(item, k) in langs"
        :key="k"
        :class="{'open': openLangs.includes(item.code)}"
        @click="changeOpenLangs(item.code)"
        >
        {{ item.lang }}
        <i></i>
      </span>
    </div>
    <button class="btn" :class="{load: loading}" @click="submitTranslate">
      <span v-if="loading"></span>
      <template v-else>翻译</template>
    </button>

    <ul class="result" v-if="translateResult.length > 0">
      <li class="title">
        <span class="code">语言</span>
        <span class="text">翻译</span>
      </li>
      <li v-for="(item, k) in translateResult" :key="k">
        <span class="code">{{ item.code }}</span>
        <span class="text">{{ item.text }} <button @click="copyClick(item.text)">copy</button> </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import langs from './config/langs'
import { getTranslateApi } from './api/api'
const translateText = ref('')
const translateResult = ref([])
const openLangs = ref(['zh-CN', 'zh-TW', 'en'])
const loading = ref(false)
const remind = ref(false)


const changeOpenLangs = (code: string) => {
  const index = openLangs.value.indexOf(code)
  if (index >= 0) {
    openLangs.value.splice(index, 1)
  } else {
    openLangs.value.push(code)
  }
}

const submitTranslate = () => {
  if (translateText.value === '') {
    remind.value = true
    return
  }
  if (loading.value) {
    return
  }
  const params = {
    langs: JSON.stringify(openLangs.value),
    text: translateText.value
  }
  loading.value = true
  getTranslateApi(params).then(res => {
    translateResult.value = res.data
    loading.value = false
  })
}

const copyClick = (text:string) => {
  const textArea = document.createElement('textArea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

const focus = () => {
  remind.value = false
}

onMounted(() => {})

</script>

<style scoped lang="less">
* {
  padding: 0;
  margin: 0;
  font-style: normal;
  box-sizing: border-box;
  text-decoration: none;
  outline: none;
}
ul,li,ol{list-style: none;}
.main {
  max-width: 866px;
  margin: auto;
  padding: 0 10px;
  .textarea {
    display: block;
    width: 100%;
    height: 200px;
    padding: 15px;
    font-size: 16px;
    font-family: auto;
    color: #444;
    border: 1px solid #444;
    border-radius: 10px;
    &.remind {
      border-color: #f1435a;
    }
  }
}

header {
  display: flex;
  padding: 30px 0;
  justify-content: center;
  line-height: 40px;
  img {
    display: inline-block;
    width: 40px;
  }
  i {
    font-size: 24px;
    margin-left: 30px;
    color: #808080;
  }
}
.lang {
  display: block;
  padding-top: 10px;
  span {
    display: inline-block;
    font-size: 12px;
    margin: 0 20px 20px 0;
    text-align: center;
    i {
      position: relative;
      display: block;
      height: 24px;
      line-height: 24px;
      margin-top: 5px;
      padding: 0 35px;
      background: #F0F0F0;
      border-radius: 24px;
      color: #444;
      border: 1px solid #ddd;
      cursor: pointer; 
      &:after {
        position: absolute;
        content: '';
        width: 22px;
        height: 22px;
        right: calc(100% - 23px);
        top: 0;
        background: white;
        border-radius: 30px;
        transition: .3s;
      }
    }
    &.open {
      i {
        background: rgb(109, 158, 235);
        border: 1px solid rgb(25,103,210);
        &::after {
          right: 0;
        }
      }
    }
  }
}
.btn {
  position: relative;
  display: block;
  width: 120px;
  height: 34px;
  margin-top: 30px;
  line-height: 34px;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  text-align: center;
  background: #6d9eeb;
  color: #fff;
  cursor: pointer;
  &.load {
    background: #5c5c5c;
  }
  span {
    position: absolute;
    left: 50px;
    top: 7px;
    width: 20px;
    height: 20px;
    border: 2px solid #fff;
    border-radius: 100%;
    border-top-color: #5c5c5c;
    animation:  rotate 1s infinite;
  }
}

.result {
  margin-top: 50px;
  border: 1px solid #ddd;
  border-bottom: none;
  li {
    position: relative;
    border-bottom: 1px solid #ddd;
    padding: 6px 0 6px 100px;
    font-size: 14px;
    &.title {
      background: #eaeaea;
      font-size: 16px;
      padding: 8px 0 8px 100px;
    }
    span {
      display: inline-block;
      padding: 0 10px;
    }
    .code {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100px;
      text-align: center;
      border-right: 1px solid #ddd;
      transform: translateY(-50%);
    }
    .text {
      width: calc(100% - 100px);
    }
    button {
      position: absolute;
      right: 10px;
      padding: 0 5px;
      cursor: pointer;
    }
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>