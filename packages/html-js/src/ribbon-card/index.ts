export function skRibbonCardHTML(options: {
  title: string;
  body: string;
  ribbonLabel?: string;
  ribbonVariant?: 'yellow' | 'green' | 'purple' | 'blue' | 'red';
}): string {
  const { title, body, ribbonLabel, ribbonVariant = 'yellow' } = options;
  const ribbon = ribbonLabel
    ? `<div class="sk-ribbon-card__ribbon sk-ribbon-card__ribbon--${ribbonVariant}">${ribbonLabel}</div>`
    : '';
  return `<article class="sk-ribbon-card">
  ${ribbon}
  <div class="sk-ribbon-card__content">
    <h4 class="sk-h4">${title}</h4>
    <p>${body}</p>
  </div>
</article>`;
}

export const SkRibbonCardDefaultHTML = skRibbonCardHTML({
  title: 'SemVer release channel',
  body: 'Production-ready releases with our standard breaking-change policy.',
});

export const SkRibbonCardWithRibbonHTML = skRibbonCardHTML({
  title: 'Full-day rollout workshop',
  body: 'Get product, engineering, and reviewers aligned on Spec Kitty in your environment.',
  ribbonLabel: 'Primary Workshop',
  ribbonVariant: 'yellow',
});
