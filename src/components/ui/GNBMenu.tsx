import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Github, Instagram, Mail, X } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

const MenuItems = ['github', 'instagram', 'email'] as const;

interface MenuItemProps {
  item: (typeof MenuItems)[number];
  index: number;
}

const MenuMap = {
  github: GithubMenu,
  instagram: InstagramMenu,
  email: EmailMenu,
} as const;

function GithubMenu({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href="https://github.com/sngminn"
      className={className}
      style={style}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Github className="w-9 h-9 text-white" />
      <span>{children}</span>
      <ExternalLink className="opacity-50 text-white" />
    </a>
  );
}
function InstagramMenu({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href="https://www.instagram.com/solmin.works/"
      className={className}
      style={style}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Instagram className="w-9 h-9 text-white" />
      <span>{children}</span>
      <ExternalLink className="opacity-50 text-white" />
    </a>
  );
}

function EmailMenu({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className: string;
  style?: React.CSSProperties;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  async function clickHandler() {
    try {
      await navigator.clipboard.writeText('me@kimseungmin.dev');
      setCopied(true);
    } catch (e) {
      console.error('클립보드 복사 실패:', e);
    }
  }
  return (
    <motion.button
      layout
      transition={{ layout: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
      type="button"
      onClick={clickHandler}
      className={className}
      style={style}
    >
      <motion.div layout>
        <Mail className="w-9 h-9 text-white" />
      </motion.div>
      <motion.div layout className="relative overflow-x-hidden flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {copied ? (
            <motion.span
              layout
              key="copied"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.4 }}
              className="inline-block whitespace-nowrap font-semibold text-transparent bg-clip-text bg-linear-to-b from-white to-[#ffffff70]"
            >
              클립보드에 복사되었어요
            </motion.span>
          ) : (
            <motion.span
              layout
              key="original"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.4 }}
              className="inline-block whitespace-nowrap text-transparent bg-clip-text bg-linear-to-b from-white to-[#ffffff70]"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}

function MenuItem({ item, index }: MenuItemProps) {
  const MenuComp = MenuMap[item];
  return (
    <motion.li
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ ease: [0, 0.8, 0.2, 1], duration: 1, delay: index * 0.1 }}
      className="px-8 py-3 flex justify-center items-center"
    >
      <MenuComp
        className="text-transparent bg-clip-text bg-linear-to-b from-white to-[#ffffff70] cursor-pointer text-2xl font-suite uppercase font-bold flex gap-4 justify-center items-center transform-gpu"
        style={{ WebkitBackgroundClip: 'text' }}
      >
        {item}
      </MenuComp>
    </motion.li>
  );
}

interface MenuContainerProps {
  menuHandler: () => void;
}

export default function GNBMenu({ menuHandler }: MenuContainerProps) {
  return (
    <div className="fixed flex justify-center items-center inset-0 z-800 w-screen h-screen">
      <motion.button
        type="button"
        onClick={(e) => {
          if (e.target === e.currentTarget) menuHandler();
        }}
        className="absolute bg-[#000000a0] w-full h-full -z-10 transform-gpu"
        initial={{ backdropFilter: 'blur(0px)', opacity: 0 }}
        animate={{ backdropFilter: 'blur(24px)', opacity: 1 }}
        transition={{ ease: [0, 0.8, 0.2, 1], duration: 0.5 }}
      />
      <div className="max-w-[1080px] w-full fixed top-0 mx-auto flex justify-end">
        <motion.button
          type="button"
          onClick={menuHandler}
          className="cursor-pointer px-4 py-3 border-none bg-transparent text-white"
          initial={{ rotate: -45 }}
          animate={{ rotate: 0 }}
          transition={{ ease: [0, 1, 0, 1], duration: 0.4 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
      </div>
      <ul className="flex flex-col gap-12 list-none p-0 m-0">
        {MenuItems.map((item, index) => (
          <MenuItem key={item} item={item} index={index} />
        ))}
      </ul>
    </div>
  );
}
