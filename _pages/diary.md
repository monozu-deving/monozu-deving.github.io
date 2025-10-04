---
title: "Diary"
layout: archive
permalink: /diary/
author_profile: true
redirect_from:
  - /categories/diary/
# (선택) 히어로 영역 커스텀
header:
  overlay_color: "#000"
  overlay_filter: 0.3
  overlay_image: /assets/images/diary.png
---

{% if site.categories['diary'] %}
  {% assign list = site.categories['diary'] | sort: 'date' | reverse %}
  {% for post in list %}
    {% include archive-single.html %}
  {% endfor %}
{% else %}
  <p>아직 diary에 글이 없습니다.</p>
{% endif %}

