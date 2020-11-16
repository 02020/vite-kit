<template>
  <ul class="sidebar">
    <SideBarItem v-for="item of items" :item="item" />
  </ul>
</template>

<script src="./SideBar"></script>

<style>
.sidebar,
.sidebar-items {
  list-style-type: none;
  line-height: 2;
  padding: 0;
  margin: 0;
}

.sidebar-items .sidebar-items {
  padding-left: 1.5rem;
  border-bottom: 1px solid #dbecff;
}

.sidebar-items .sidebar-items .sidebar-link {
  border-left: 0;
}

.sidebar-items .sidebar-items .sidebar-link.active {
  font-weight: 500;
}

.sidebar-items .sidebar-link {
  padding: 0.35rem 1rem 0.35rem 2rem;
  line-height: 1.4;
  font-size: 0.9em;
  font-weight: 400;
}

.sidebar-link {
  display: block;
  margin: 0;
  border-left: 0.25rem solid transparent;
  padding: 0.35rem 1.5rem 0.35rem 1.25rem;
  line-height: 1.7;
  font-size: 1em;
  font-weight: 600;
  color: var(--text-color);
}

a.sidebar-link {
  transition: color 0.15s ease;
}

a.sidebar-link:hover {
  color: var(--accent-color);
}

a.sidebar-link.active {
  border-left-color: var(--accent-color);
  font-weight: 600;
  color: var(--accent-color);
}
</style>
