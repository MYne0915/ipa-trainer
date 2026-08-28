export type TabKey = "list" | "quiz" | "words";

const TABS: { key: TabKey; label: string }[] = [
  { key: "list", label: "一覧" },
  { key: "quiz", label: "クイズ" },
  { key: "words", label: "苦手単語" },
];

type Props = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`tab-bar__item${active === tab.key ? " tab-bar__item--active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
