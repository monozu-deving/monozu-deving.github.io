---
title: "Graphic — 그래픽/디자인"
layout: archive
permalink: /categories/graphic/
author_profile: true
---

{% if site.categories.diary %}
  {% assign list = site.categories.diary | sort: "date" | reverse %}
  {% for post in list %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  <p>아직 Graphic에 글이 없습니다.</p>
{% endif %}
