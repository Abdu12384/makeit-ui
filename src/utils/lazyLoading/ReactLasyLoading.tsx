import React, { lazy, Suspense, ComponentType, ReactNode } from "react";
import LazyLoadingAnimation from "../animations/lazyLoading";



export function lazyWithFallback<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: ReactNode = <LazyLoadingAnimation visible={true} />
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFunc);

  const Wrapper: ComponentType<React.ComponentProps<T>> = (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return Wrapper;
}
