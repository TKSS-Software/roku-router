# Deferred Navigation Issue - Technical Report

**Date:** 2026-07-03  
**Status:** 2 of 74 tests failing (97% pass rate)  
**Branch:** refined-navivation-control-and-AI-supporting-documents

## Summary

The router has a critical bug in its deferred navigation feature (`abortCurrentNavigation: false`) when deferred navigations are executed after concurrent navigations complete. This causes Roku BrightScript Dot Operator errors (code 236) indicating attempts to call methods on Invalid objects.

## Test Results

| Metric | Value |
|--------|-------|
| Total Tests | 74 |
| Passing | 72 |
| Failing | 2 |
| Pass Rate | 97.3% |

## Fixed Issues

✅ **Race Condition in Promise Chain Handling**

**Test:** "an invalid navigateTo does not cancel a healthy in-flight navigation"  
**Fix:** Properly await concurrent promise chains before test completion  
**Status:** FIXED - Test now passes

The issue was that fire-and-forget promise chains weren't being properly awaited, creating race conditions where test assertions ran before promise chains completed.

**Solution:** Use barrier pattern - create promise chain without calling `.toPromise()`, then explicitly await it within another promise chain's `.then()` block:

```brightscript
m.badBarrier = promises.chain(bad, m).then(...).catch(...)  ' no toPromise yet
return promises.chain(nav1, m).then(function(_, m)
    return m.badBarrier.toPromise()  ' ensure bad completes before assertions
end function).then(...)
```

## Remaining Issues

❌ **Deferred Navigation State Corruption**

**Tests Affected:**
1. "runs after the in-flight navigation instead of cancelling it, pushing on top (back returns to it)"
2. "drops (rejects) a pending deferred navigation when a normal navigateTo takes over"

**Error:** `'Dot' Operator attempted with invalid BrightScript Component or interface reference`

**Error Code:** 236 (Roku VM runtime error)

### Root Cause Analysis

The error occurs when a deferred navigation (`abortCurrentNavigation: false`) is queued and then executed after another concurrent navigation completes. The sequence that triggers the bug:

#### Scenario 1: Deferred nav after goBack

```
1. navY completes, navigationInProgress = false
2. goBack() called - returns boolean, async promise chain pending
3. navigateTo(/x, { abortCurrentNavigation: false }) called
   - navigationInProgress is still false (goBack hasn't reached NavigationStart yet)
   - Nav runs immediately instead of deferring
4. Concurrent promise chains execute:
   - goBack: NavigationStart → showView → NavigationEnd → _runPendingNavigation
   - deferred nav: _navigateTo → _navigateToImpl → reuse logic
5. At some point, m.__router_activeView or related state becomes Invalid
6. Promise chain tries to call a method on the Invalid object → Dot Operator error
```

#### Scenario 2: Deferred nav with replacement navigation

```
1. nav(/x) in flight, nav(/y) deferred, nav(/z) called
2. nav(/z) cancels nav(/x) and drops pending nav(/y)
3. Deferred nav(/y) is executed via _runPendingNavigation
4. Similar state corruption occurs when promise chains interfere
```

### Why It Happens

**Root Factor:** BrightScript Promise Context Boundary Issues

From CLAUDE.md: "Nested AAs don't reliably survive the promise context — keep promise-context payloads flat."

When multiple promise chains run concurrently and access shared router state (`m.__router_*` variables), especially `m.__router_activeView`, the following can occur:

1. **Promise Context Switching:** When a promise callback executes in a different context, object references may become stale or invalid
2. **Concurrent State Mutation:** Two promise chains may be modifying `m.__router_activeView` simultaneously
3. **Lifecycle Overlap:** View lifecycle callbacks (`_onViewOpen`, `_onRouteUpdate`, `_beforeViewSuspend`, etc.) from concurrent navigations may interfere
4. **Property Access Failures:** Attempting to access properties on objects that have become Invalid in the promise context

### The Dot Operator Error

Error code 236 from the Roku VM indicates:
- Code is trying to use the dot operator (`.`) on an Invalid object
- Example: `Invalid.someMethod()` or `Invalid.someProperty`
- This is a low-level interpreter error that occurs at runtime

The error is NOT being caught by normal BrightScript error handling, suggesting it occurs:
- During promise library internals
- In View component lifecycle methods  
- During rodash utility function execution with corrupt objects
- In promise callback context management

## Diagnostic Findings

### Failed Investigation Attempts

1. **Try-Catch Wrapping:** Added error handling at multiple points in `_navigateToImpl` and `_runPendingNavigation` - errors still not caught, suggesting they occur outside these functions
2. **State Validation:** Added checks for Invalid view/route objects - didn't prevent the error
3. **Context Isolation:** Attempted to skip reuse during deferred nav execution - broke other tests (31 passing instead of 72)
4. **Promise Serialization:** Attempted to serialize navigation operations - would require architectural changes

### Evidence of the Bug

1. **Active Route State:** When error occurs, `getActiveRoute()` returns `/y` instead of expected `/x`, indicating view state is inconsistent with navigation state
2. **Consistent Failure Pattern:** Both failing tests follow the pattern of deferred nav after concurrent navigation
3. **Promise Chain Depth:** Error occurs in promise callback execution, not synchronous code
4. **Isolation Factor:** All other 72 tests pass, indicating the bug is specific to deferred navigation concurrency

## What's Needed to Fix

### Option 1: Step-Through Debugging (Recommended)

**Tools Required:**
- Roku IDE debugger with breakpoint support
- Ability to inspect promise chain execution context
- View into internal promises library state

**Process:**
1. Set breakpoint when Dot Operator error occurs
2. Inspect call stack to see which function is accessing Invalid
3. Trace backwards to understand how the object became Invalid
4. Identify the concurrent operation that corrupted the state
5. Add synchronization or state protection

### Option 2: Promise Context Redesign

**Approach:** Redesign `_runPendingNavigation` to not share state across promise contexts

**Changes Needed:**
```brightscript
sub _runPendingNavigation()
    ' Instead of sharing m.__router_* state across promise contexts,
    ' copy all necessary state BEFORE entering the promise chain
    pending = m.__router_pendingNavigation
    m.__router_pendingNavigation = Invalid
    
    ' Capture current state into local variables
    currentActiveView = m.__router_activeView
    currentRoutes = m.__router_routes
    currentOutlet = m.__router_outlet
    
    ' Don't access m.__router_* inside promise callbacks
    navResult = _navigateTo(pending.path, pending.options)
    _settleInto(navResult, pending.deferred)
end sub
```

### Option 3: Navigation Serialization

**Approach:** Queue pending navigations instead of allowing concurrent execution

**Changes Needed:**
- Add navigation queue management
- Ensure only one navigation executes at a time
- Break the concurrency that causes state corruption

## Workarounds

Until the underlying bug is fixed, the following workarounds are available:

### Workaround 1: Avoid Deferred Navigation After goBack

Instead of:
```brightscript
sgRouter.goBack({ router: m.router })
sgRouter.navigateTo("/x", { router: m.router, abortCurrentNavigation: false })
```

Use:
```brightscript
' Queue the deferred nav during an existing in-flight navigation
inFlightNav = sgRouter.navigateTo("/x", { router: m.router })
sgRouter.goBack({ router: m.router })
' Later, check inFlightNav result
```

### Workaround 2: Use Promise Chains Instead

```brightscript
return promises.chain(sgRouter.navigateTo("/x", { router: m.router }), m).then(function(_, m)
    ' Use deferred nav only from within promise callbacks
    return sgRouter.navigateTo("/y", { router: m.router, abortCurrentNavigation: false })
end function)
```

### Workaround 3: Avoid Deferred Reuse Scenario

Don't navigate to the same route that's currently active via deferred navigation. The reuse logic that tries to call `_onRouteUpdate` is where corruption manifests.

## Files Modified

During investigation and attempted fixes:
- `src/components/Router.bs` - Added defensive checks (later reverted)
- `src/source/router.spec.bs` - Fixed test promise chain race conditions (KEPT)

## Future Work

1. **Immediate:** Document this issue and workarounds for developers using `abortCurrentNavigation: false`
2. **Short-term:** Restrict deferred navigation usage patterns in internal router logic
3. **Medium-term:** Obtain Roku IDE debugger to trace promise context corruption
4. **Long-term:** Redesign promise context handling or migrate to a more robust promise library

## References

- **CLAUDE.md:** Router scope constraints and promise gotchas
- **memory/interruptible_navigation.md:** Deferred navigation implementation details
- **Test file:** `src/source/router.spec.bs` lines 895-984

## Contact

For questions about this issue, refer to the branch: `refined-navivation-control-and-AI-supporting-documents`
