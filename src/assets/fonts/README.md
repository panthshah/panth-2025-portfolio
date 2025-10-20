# Samsung Fonts Setup

## Required Font Files

Place the following font files in this directory (`src/assets/fonts/`):

### Samsung Sharp Sans
- `SamsungSharpSans-Bold.woff2` / `SamsungSharpSans-Bold.woff`
- `SamsungSharpSans-Medium.woff2` / `SamsungSharpSans-Medium.woff`
- `SamsungSharpSans-Regular.woff2` / `SamsungSharpSans-Regular.woff`

### Samsung One
- `SamsungOne-700.woff2` / `SamsungOne-700.woff`
- `SamsungOne-600.woff2` / `SamsungOne-600.woff`
- `SamsungOne-400.woff2` / `SamsungOne-400.woff`

## How to Use

Once the font files are added, you can use them in your components:

### With Tailwind CSS:
```jsx
<h1 className="font-samsung-sharp font-bold">Heading</h1>
<p className="font-samsung-one">Body text</p>
```

### With inline styles:
```jsx
<h1 style={{ fontFamily: 'Samsung Sharp Sans' }}>Heading</h1>
<p style={{ fontFamily: 'Samsung One' }}>Body text</p>
```

## Where to Get the Fonts

These are Samsung's proprietary fonts. You can get them from:
- Samsung Design System
- Your Figma file (if they're embedded)
- Samsung's official font resources

## Note
Make sure you have the proper licensing to use these fonts in your project.

