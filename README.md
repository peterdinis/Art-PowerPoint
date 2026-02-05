# Presentation Builder

Aplikace pro vytváření prezentací podobná PowerPointu, postavená na Next.js, TypeScript a React.

## Funkce

- 📊 **Dashboard** - Přehled všech prezentací
- ✏️ **Editor** - Vytváření a úprava slideů
- 🎨 **Elementy** - Text, obrázky, tvary
- 💾 **Ukládání** - Automatické ukládání do localStorage
- 🎯 **Drag & Drop** - Přesouvání elementů na slidech

## Technologie

- **Next.js 16** - React framework
- **TypeScript** - Typování
- **Zustand** - State management
- **React DnD** - Drag and drop
- **Tailwind CSS** - Stylování
- **Lucide React** - Ikony

## Instalace

```bash
npm install
```

## Spuštění

```bash
npm run dev
```

Aplikace poběží na [http://localhost:3000](http://localhost:3000)

## Struktura projektu

```
presentation-builder/
├── app/
│   ├── page.tsx          # Dashboard
│   ├── editor/
│   │   └── page.tsx       # Editor stránka
│   └── layout.tsx
├── components/
│   ├── EditorCanvas.tsx   # Hlavní plátno pro editaci
│   ├── SlideElement.tsx   # Element na slide
│   ├── SlidePanel.tsx     # Panel se slidey
│   ├── Toolbar.tsx        # Nástroje
│   └── PropertiesPanel.tsx # Vlastnosti elementu
├── lib/
│   ├── types/
│   │   └── presentation.ts # Typy pro prezentace
│   └── store/
│       └── presentationStore.ts # Zustand store
└── components/
```

## Použití

1. **Vytvoření prezentace**: Na dashboardu klikněte na "Vytvořit novou prezentaci"
2. **Přidání elementů**: V editoru použijte toolbar pro přidání textu, obrázků nebo tvarů
3. **Úprava elementů**: Klikněte na element a upravte ho v panelu vlastností
4. **Správa slideů**: V levém panelu můžete přidávat, mazat a duplikovat slidey
5. **Uložení**: Prezentace se automaticky ukládají do localStorage

## Budoucí vylepšení

- [ ] Export do PDF
- [ ] Export do PowerPoint
- [ ] Více typů elementů (grafy, tabulky)
- [ ] Animace a přechody
- [ ] Spolupráce v reálném čase
- [ ] Backend API pro ukládání do cloudu
