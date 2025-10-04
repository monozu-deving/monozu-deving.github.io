---
title: "AI — AI 이론 공부 기록"
layout: archive
permalink: /ai/
author_profile: true
redirect_from:
  - /categories/ai/
# (선택) 히어로 영역 커스텀
header:
  overlay_color: "#000"
  overlay_filter: 0.3
  overlay_image: /assets/images/ai.png
---

{% if site.categories['ai'] %}
  {% assign list = site.categories['ai'] | sort: 'date' | reverse %}
  {% for post in list %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  <p>아직 AI에 글이 없습니다.</p>
{% endif %}

