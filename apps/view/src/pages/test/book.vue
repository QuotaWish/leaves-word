<script setup lang="ts">
import { Book, BookHeader, BookTitle, BookDescription } from '~/components/inspira/book'
</script>

<template>
  <div bg-black class="grid place-content-center p-10">
    <Book size="sm">
      <BookHeader>
        <Icon name="heroicons:book-open-solid" size="24" />
      </BookHeader>
      <BookTitle>
        <h1>The Book</h1>
      </BookTitle>
      <BookDescription>
        <p>Hover me to animate!</p>
      </BookDescription>
    </Book>
  </div>
</template>
