---
title: "graphic"
layout: archive
permalink: /graphic/
author_profile: true
redirect_from:
  - /categories/graphic/
# (선택) 히어로 영역 커스텀
header:
  overlay_color: "#000"
  overlay_filter: 0.3
  overlay_image: /assets/images/graphic.png
---

{% if site.categories['graphic'] %}
  {% assign list = site.categories['graphic'] | sort: 'date' | reverse %}
  {% for post in list %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  <p>아직 graphic에 글이 없습니다.</p>
{% endif %}

