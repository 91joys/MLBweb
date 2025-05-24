<script setup>
import Card from "../components/card.vue";
import picture from "/src/assets/images/players/17-Shohei-Ohtani.png";
</script>

<template>
  <main>
    <Card
      Player_Name="Shohei Ohtani"
      Chinese_Name="大谷翔平"
      Social_Link="https://www.instagram.com/shoheiohtani"
      Nickname="Sho-time"
      Number="17"
      Position="投手, 指定打席"
      :Image_URL="picture"
      Birthday="07/05/1994"
      Nationality="日本"
      MLB_Debut="03/29/2018"
      Dodgers_Debut="03/20/2024"
      :Achievements="[
        '2021年美國聯盟最有價值球員',
        '2021年美國聯盟最佳指定打擊',
      ]"
    />
  </main>
</template>
