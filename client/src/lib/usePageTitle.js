import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Future SoftTech` : 'Future SoftTech';
  }, [title]);
}
