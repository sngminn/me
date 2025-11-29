import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(<Home />);
      expect(screen.getByText(/To get started/i)).toBeInTheDocument();
    });

    it('should render the main container', () => {
      const { container } = render(<Home />);
      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });

    it('should render all major sections', () => {
      const { container } = render(<Home />);
      
      // Check for main layout div
      const mainDiv = container.querySelector('.flex.min-h-screen');
      expect(mainDiv).toBeInTheDocument();
      
      // Check for main element
      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('Next.js Logo', () => {
    it('should render Next.js logo image', () => {
      render(<Home />);
      const logo = screen.getByAltText('Next.js logo');
      expect(logo).toBeInTheDocument();
    });

    it('should have correct logo dimensions', () => {
      render(<Home />);
      const logo = screen.getByAltText('Next.js logo');
      expect(logo).toHaveAttribute('width', '100');
      expect(logo).toHaveAttribute('height', '20');
    });

    it('should have correct logo source', () => {
      render(<Home />);
      const logo = screen.getByAltText('Next.js logo');
      expect(logo).toHaveAttribute('src', '/next.svg');
    });

    it('should have priority loading for logo', () => {
      render(<Home />);
      const logo = screen.getByAltText('Next.js logo');
      expect(logo).toHaveAttribute('priority');
    });

    it('should have dark mode invert class', () => {
      render(<Home />);
      const logo = screen.getByAltText('Next.js logo');
      expect(logo).toHaveClass('dark:invert');
    });
  });

  describe('Heading Content', () => {
    it('should render main heading', () => {
      render(<Home />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('To get started, edit the page.tsx file.');
    });

    it('should have correct heading styling', () => {
      render(<Home />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-3xl');
      expect(heading).toHaveClass('font-semibold');
    });

    it('should render introductory paragraph', () => {
      render(<Home />);
      const paragraph = screen.getByText(/Looking for a starting point/i);
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe('External Links', () => {
    it('should render Templates link', () => {
      render(<Home />);
      const templatesLink = screen.getByRole('link', { name: /Templates/i });
      expect(templatesLink).toBeInTheDocument();
    });

    it('should have correct Templates link href', () => {
      render(<Home />);
      const templatesLink = screen.getByRole('link', { name: /Templates/i });
      expect(templatesLink).toHaveAttribute('href');
      expect(templatesLink.getAttribute('href')).toContain('vercel.com/templates');
    });

    it('should render Learning link', () => {
      render(<Home />);
      const learningLink = screen.getByRole('link', { name: /Learning/i });
      expect(learningLink).toBeInTheDocument();
    });

    it('should have correct Learning link href', () => {
      render(<Home />);
      const learningLink = screen.getByRole('link', { name: /Learning/i });
      expect(learningLink).toHaveAttribute('href');
      expect(learningLink.getAttribute('href')).toContain('nextjs.org/learn');
    });

    it('should render Deploy Now link', () => {
      render(<Home />);
      const deployLink = screen.getByRole('link', { name: /Deploy Now/i });
      expect(deployLink).toBeInTheDocument();
    });

    it('should have correct Deploy Now link href', () => {
      render(<Home />);
      const deployLink = screen.getByRole('link', { name: /Deploy Now/i });
      expect(deployLink).toHaveAttribute('href');
      expect(deployLink.getAttribute('href')).toContain('vercel.com/new');
    });

    it('should render Documentation link', () => {
      render(<Home />);
      const docsLink = screen.getByRole('link', { name: /Documentation/i });
      expect(docsLink).toBeInTheDocument();
    });

    it('should have correct Documentation link href', () => {
      render(<Home />);
      const docsLink = screen.getByRole('link', { name: /Documentation/i });
      expect(docsLink).toHaveAttribute('href');
      expect(docsLink.getAttribute('href')).toContain('nextjs.org/docs');
    });

    it('should have target="_blank" for all external links', () => {
      render(<Home />);
      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
      });
    });

    it('should have rel="noopener noreferrer" for security', () => {
      render(<Home />);
      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Vercel Logo', () => {
    it('should render Vercel logomark', () => {
      render(<Home />);
      const vercelLogo = screen.getByAltText('Vercel logomark');
      expect(vercelLogo).toBeInTheDocument();
    });

    it('should have correct Vercel logo dimensions', () => {
      render(<Home />);
      const vercelLogo = screen.getByAltText('Vercel logomark');
      expect(vercelLogo).toHaveAttribute('width', '16');
      expect(vercelLogo).toHaveAttribute('height', '16');
    });

    it('should have correct Vercel logo source', () => {
      render(<Home />);
      const vercelLogo = screen.getByAltText('Vercel logomark');
      expect(vercelLogo).toHaveAttribute('src', '/vercel.svg');
    });
  });

  describe('Layout Structure', () => {
    it('should have proper flex layout classes', () => {
      const { container } = render(<Home />);
      const mainDiv = container.querySelector('.flex.min-h-screen');
      expect(mainDiv).toHaveClass('items-center');
      expect(mainDiv).toHaveClass('justify-center');
    });

    it('should have responsive design classes', () => {
      const { container } = render(<Home />);
      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('sm:items-start');
    });

    it('should have dark mode styling', () => {
      const { container } = render(<Home />);
      const mainDiv = container.querySelector('.flex.min-h-screen');
      expect(mainDiv?.className).toContain('dark:bg-black');
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive button widths', () => {
      render(<Home />);
      const deployLink = screen.getByRole('link', { name: /Deploy Now/i });
      expect(deployLink.className).toContain('md:w-[158px]');
      expect(deployLink.className).toContain('w-full');
    });

    it('should have responsive flex direction', () => {
      const { container } = render(<Home />);
      const buttonsContainer = container.querySelector('.flex.flex-col.gap-4');
      expect(buttonsContainer?.className).toContain('sm:flex-row');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Home />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('should have descriptive link text', () => {
      render(<Home />);
      const templatesLink = screen.getByRole('link', { name: /Templates/i });
      const learningLink = screen.getByRole('link', { name: /Learning/i });
      const deployLink = screen.getByRole('link', { name: /Deploy Now/i });
      const docsLink = screen.getByRole('link', { name: /Documentation/i });

      expect(templatesLink).toHaveAccessibleName();
      expect(learningLink).toHaveAccessibleName();
      expect(deployLink).toHaveAccessibleName();
      expect(docsLink).toHaveAccessibleName();
    });

    it('should have alt text for all images', () => {
      render(<Home />);
      const nextLogo = screen.getByAltText('Next.js logo');
      const vercelLogo = screen.getByAltText('Vercel logomark');

      expect(nextLogo).toHaveAttribute('alt');
      expect(vercelLogo).toHaveAttribute('alt');
    });

    it('should use semantic HTML elements', () => {
      const { container } = render(<Home />);
      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('Content Presence', () => {
    it('should display all expected text content', () => {
      render(<Home />);

      expect(screen.getByText(/To get started, edit the page.tsx file./i)).toBeInTheDocument();
      expect(screen.getByText(/Looking for a starting point/i)).toBeInTheDocument();
      expect(screen.getByText(/Templates/i)).toBeInTheDocument();
      expect(screen.getByText(/Learning/i)).toBeInTheDocument();
      expect(screen.getByText(/Deploy Now/i)).toBeInTheDocument();
      expect(screen.getByText(/Documentation/i)).toBeInTheDocument();
    });

    it('should have all call-to-action buttons', () => {
      render(<Home />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Styling Classes', () => {
    it('should have proper spacing classes', () => {
      const { container } = render(<Home />);
      const mainElement = container.querySelector('main');
      expect(mainElement?.className).toContain('py-32');
      expect(mainElement?.className).toContain('px-16');
    });

    it('should have proper gap classes', () => {
      const { container } = render(<Home />);
      const contentDiv = container.querySelector('.flex.flex-col.items-center.gap-6');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should have proper text styling classes', () => {
      render(<Home />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.className).toContain('leading-10');
      expect(heading.className).toContain('tracking-tight');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple renders without errors', () => {
      const { rerender } = render(<Home />);
      rerender(<Home />);
      rerender(<Home />);
      
      expect(screen.getByText(/To get started/i)).toBeInTheDocument();
    });

    it('should maintain structure across re-renders', () => {
      const { container, rerender } = render(<Home />);
      const initialHTML = container.innerHTML;
      
      rerender(<Home />);
      const afterRerender = container.innerHTML;
      
      expect(afterRerender).toBe(initialHTML);
    });
  });

  describe('Button Styling', () => {
    it('should have proper Deploy Now button styling', () => {
      render(<Home />);
      const deployLink = screen.getByRole('link', { name: /Deploy Now/i });
      expect(deployLink.className).toContain('rounded-full');
      expect(deployLink.className).toContain('bg-foreground');
    });

    it('should have proper Documentation button styling', () => {
      render(<Home />);
      const docsLink = screen.getByRole('link', { name: /Documentation/i });
      expect(docsLink.className).toContain('rounded-full');
      expect(docsLink.className).toContain('border');
    });

    it('should have hover states defined', () => {
      render(<Home />);
      const deployLink = screen.getByRole('link', { name: /Deploy Now/i });
      expect(deployLink.className).toContain('hover:bg-[#383838]');
    });
  });
});