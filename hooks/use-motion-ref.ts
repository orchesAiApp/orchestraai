## Error Type
Console Error

## Error Message
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <SegmentViewNode type="page" pagePath="page.tsx">
      <SegmentTrieNode>
      <Home>
        <main className="min-h-scre...">
          <Navigation>
          ...
            <div className="max-w-7xl ...">
              <div className="grid md:gr...">
                <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} transition={{duration:0.8}} ...>
                  <div className="h-full" style={{opacity:0, ...}} ref={function useMotionRef.useCallback}>
                    <WorkflowVisualization>
                      <div className="relative w...">
                        <svg className="absolute i..." style={{...}}>
                          <defs>
                          <motion.line x1={641.4000000000001} y1={272.7} x2={2565.6000000000004} y2={477.22499999999997} ...>
                            <line
+                             x1={641.4000000000001}
-                             x1="200"
+                             y1={272.7}
-                             y1="300"
+                             x2={2565.6000000000004}
-                             x2="800"
+                             y2={477.22499999999997}
-                             y2="525"
                              stroke="#00d9ff"
                              strokeWidth={1.5}
                              strokeOpacity={0.3}
                              style={{}}
                              ref={function useMotionRef.useCallback}
                            >
                          <motion.line x1={641.4000000000001} y1={681.75} x2={2565.6000000000004} y2={477.22499999999997} ...>
                            <line
+                             x1={641.4000000000001}
-                             x1="200"
+                             y1={681.75}
-                             y1="750"
+                             x2={2565.6000000000004}
-                             x2="800"
+                             y2={477.22499999999997}
-                             y2="525"
                              stroke="#00d9ff"
                              strokeWidth={1.5}
                              strokeOpacity={0.3}
                              style={{}}
                              ref={function useMotionRef.useCallback}
                            >
                          <motion.line x1={2565.6000000000004} y1={477.22499999999997} x2={4489.800000000001} ...>
                            <line
+                             x1={2565.6000000000004}
-                             x1="800"
+                             y1={477.22499999999997}
-                             y1="525"
+                             x2={4489.800000000001}
-                             x2="1400"
+                             y2={204.52499999999998}
-                             y2="225"
                              stroke="#00d9ff"
                              strokeWidth={1.5}
                              strokeOpacity={0.3}
                              style={{}}
                              ref={function useMotionRef.useCallback}
                            >
                          <motion.line x1={2565.6000000000004} y1={477.22499999999997} x2={4489.800000000001} ...>
                            <line
+                             x1={2565.6000000000004}
-                             x1="800"
+                             y1={477.22499999999997}
-                             y1="525"
+                             x2={4489.800000000001}
-                             x2="1400"
+                             y2={749.925}
-                             y2="825"
                              stroke="#00d9ff"
                              strokeWidth={1.5}
                              strokeOpacity={0.3}
                              style={{}}
                              ref={function useMotionRef.useCallback}
                            >
                          <motion.line x1={4489.800000000001} y1={204.52499999999998} x2={6414.000000000001} ...>
                            <line
+                             x1={4489.800000000001}
-                             x1="1400"
+                             y1={204.52499999999998}
-                             y1="225"
+                             x2={6414.000000000001}
-                             x2="2000"
+                             y2={477.22499999999997}
-                             y2="525"
                              stroke="#00d9ff"
                              strokeWidth={1.5}
                              strokeOpacity={0.3}
                              style={{}}
                              ref={function useMotionRef.useCallback}
                            >
                          <motion.line x1={4489.800000000001} y1={749.925} x2={6414.000000000001} y2={477.22499999999997} ...>
                            <line
+                             x1={4489.800000000001}
-                             x1="1400"
+                             y1={749.925}
-                             y1="825"
+                             x2={6414.000000000001}
-                             x2="2000"
+                             y2={477.22499999999997}
-                             y2="525"
                              stroke="#00d9ff"
                              strokeWidth={1.5}
                              strokeOpacity={0.3}
                              style={{}}
                              ref={function useMotionRef.useCallback}
                            >
                        ...
          ...



    at line (<anonymous>:null:null)
    at <unknown> (components/landing/workflow-visualization.tsx:153:13)
    at Array.map (<anonymous>:null:null)
    at WorkflowVisualization (components/landing/workflow-visualization.tsx:140:22)
    at Hero (components/landing/hero.tsx:101:13)
    at Home (app/page.tsx:15:7)

## Code Frame
  151 |
  152 |           return (
> 153 |             <motion.line
      |             ^
  154 |               key={`${conn.from}-${conn.to}`}
  155 |               x1={x1}
  156 |               y1={y1}

Next.js version: 16.1.6 (Turbopack)
