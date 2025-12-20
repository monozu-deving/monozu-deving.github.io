---
title: "Math — 수학 공부 내용 기록"
layout: archive
permalink: /math/
author_profile: true
redirect_from:
  - /categories/math/
# (선택) 히어로 영역 커스텀
header:
  overlay_color: "#000"
  overlay_filter: 0.3
  overlay_image: /assets/images/math.png
---

{% if site.categories['math'] %}
  {% assign list = site.categories['math'] | sort: 'date' | reverse %}
  {% for post in list %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  <p>아직 Math에 글이 없습니다.</p>
{% endif %}

