import { useEffect, useRef } from 'react';

const useSlidingTabs = (activeTab) => {
  const navTabsRef = useRef(null);

  // Update sliding bar position
  const updateSlidingBar = (targetElement) => {
    const navTabs = navTabsRef.current;
    if (!navTabs || !targetElement) return;

    const tabRect = targetElement.getBoundingClientRect();
    const navRect = navTabs.getBoundingClientRect();

    const left = tabRect.left - navRect.left;
    const width = tabRect.width;

    navTabs.style.setProperty('--slider-left', `${left}px`);
    navTabs.style.setProperty('--slider-width', `${width}px`);
  };

  // Update when active tab changes
  useEffect(() => {
    const activeTabElement = navTabsRef.current?.querySelector(
      `[data-tab="${activeTab}"]`,
    );
    if (activeTabElement) {
      updateSlidingBar(activeTabElement);
    }
  }, [activeTab]);

  // Handle tab hover
  const handleTabHover = (event) => {
    updateSlidingBar(event.currentTarget);
  };

  // Handle mouse leave - return to active tab
  const handleNavLeave = () => {
    const activeTabElement = navTabsRef.current?.querySelector(
      `[data-tab="${activeTab}"]`,
    );
    if (activeTabElement) {
      updateSlidingBar(activeTabElement);
    }
  };

  return {
    navTabsRef,
    handleTabHover,
    handleNavLeave,
  };
};

export default useSlidingTabs;
