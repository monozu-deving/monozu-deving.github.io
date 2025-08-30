---
title: "HW — 하드웨어 로그"
layout: archive
permalink: /category/hw/
author_profile: true
---

{% if site.categories.diary %}
  {% assign list = site.categories.diary | sort: "date" | reverse %}
  {% for post in list %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  <p>아직 HW에 글이 없습니다.</p>
{% endif %}

