---
title: "HW"
layout: archive
permalink: /hw/
author_profile: true
redirect_from:
  - /categories/hw/
# (선택) 히어로 영역 커스텀
header:
  overlay_color: "#000"
  overlay_filter: 0.3
  overlay_image: /assets/images/bio-photo.jpg
---

{% if site.categories['hw'] %}
  {% assign list = site.categories['hw'] | sort: 'date' | reverse %}
  {% for post in list %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  <p>아직 HW에 글이 없습니다.</p>
{% endif %}

