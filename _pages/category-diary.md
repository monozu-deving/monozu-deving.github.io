---
title: "Diary — 일상 기록"
layout: archive
permalink: /category/diary/
author_profile: true
---

{% assign list = site.categories.diary | sort: 'date' | reverse %}
{% for post in list %}
  {% include archive-single.html %}
{% endfor %}
