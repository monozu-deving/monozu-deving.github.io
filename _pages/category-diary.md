---
title: "Diary — 일상 기록"
layout: archive
permalink: /categories/diary/
author_profile: true
---

{% if site.categories.diary %}
  {% assign list = site.categories.diary | sort: "date" | reverse %}
  {% for post in list %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  <p>아직 Diary 글이 없습니다.</p>
{% endif %}

