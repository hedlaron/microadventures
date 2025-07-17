import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

describe("useCountdown Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("initializes with correct values", () => {
    const { result } = renderHook(() => useCountdown(60));

    expect(result.current.timeLeft).toBe(60);
    expect(result.current.isExpired).toBe(false);
    expect(typeof result.current.formatTime).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("handles zero initial value correctly", () => {
    const { result } = renderHook(() => useCountdown(0));

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isExpired).toBe(true);
  });

  it("handles negative initial value correctly", () => {
    const { result } = renderHook(() => useCountdown(-5));

    expect(result.current.timeLeft).toBe(-5);
    expect(result.current.isExpired).toBe(true);
  });

  it("counts down correctly", () => {
    const { result } = renderHook(() => useCountdown(5));

    expect(result.current.timeLeft).toBe(5);
    expect(result.current.isExpired).toBe(false);

    // Advance timer by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.timeLeft).toBe(4);
    expect(result.current.isExpired).toBe(false);

    // Advance timer by 3 more seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(1);
    expect(result.current.isExpired).toBe(false);
  });

  it("expires when countdown reaches zero", () => {
    const { result } = renderHook(() => useCountdown(2));

    expect(result.current.isExpired).toBe(false);

    // Advance timer by 2 seconds to reach expiration
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isExpired).toBe(true);
  });

  it("stops counting when expired", () => {
    const { result } = renderHook(() => useCountdown(1));

    // Count down to expiration
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isExpired).toBe(true);

    // Advance more time - should stay at 0
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isExpired).toBe(true);
  });

  it("formatTime function works correctly", () => {
    const { result } = renderHook(() => useCountdown(125)); // 2:05

    const formatted = result.current.formatTime(125);
    expect(formatted).toBe("00:02:05");
  });

  it("formatTime handles different time values", () => {
    const { result: result1 } = renderHook(() => useCountdown(3661)); // 1:01:01
    expect(result1.current.formatTime(3661)).toBe("01:01:01");

    const { result: result2 } = renderHook(() => useCountdown(59)); // 0:59
    expect(result2.current.formatTime(59)).toBe("00:00:59");

    const { result: result3 } = renderHook(() => useCountdown(0)); // 0:00
    expect(result3.current.formatTime(0)).toBe("00:00:00");
  });

  it("reset function works correctly", () => {
    const { result } = renderHook(() => useCountdown(10));

    // Count down a bit
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(5);

    // Reset the countdown
    act(() => {
      result.current.reset(10);
    });

    expect(result.current.timeLeft).toBe(10);
    expect(result.current.isExpired).toBe(false);
  });

  it("reset function works after expiration", () => {
    const { result } = renderHook(() => useCountdown(2));

    // Let it expire
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isExpired).toBe(true);

    // Reset after expiration
    act(() => {
      result.current.reset(2);
    });

    expect(result.current.timeLeft).toBe(2);
    expect(result.current.isExpired).toBe(false);
  });

  it("updates when initialSeconds prop changes", () => {
    const { result, rerender } = renderHook(
      ({ initialSeconds }) => useCountdown(initialSeconds),
      { initialProps: { initialSeconds: 30 } },
    );

    expect(result.current.timeLeft).toBe(30);

    // Change the initial seconds
    rerender({ initialSeconds: 60 });

    expect(result.current.timeLeft).toBe(60);
    expect(result.current.isExpired).toBe(false);
  });

  it("handles rapid timer updates correctly", () => {
    const { result } = renderHook(() => useCountdown(3));

    // Advance timer in small increments
    act(() => {
      vi.advanceTimersByTime(500); // 0.5 seconds
    });
    expect(result.current.timeLeft).toBe(3); // Should still be 3

    act(() => {
      vi.advanceTimersByTime(500); // Complete 1 second
    });
    expect(result.current.timeLeft).toBe(2);

    act(() => {
      vi.advanceTimersByTime(1000); // 1 more second
    });
    expect(result.current.timeLeft).toBe(1);
  });
});
