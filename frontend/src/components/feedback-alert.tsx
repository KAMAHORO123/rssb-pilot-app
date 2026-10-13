"use client";

import { useEffect } from "react";
import { FeedbackState } from "../lib/types";
import { useToast } from "./toast-provider";

type FeedbackAlertProps = {
  feedback: FeedbackState;
};

export default function FeedbackAlert({ feedback }: FeedbackAlertProps) {
  const { showToast } = useToast();

  useEffect(() => {
    if (!feedback) {
      return;
    }

    showToast({
      type: feedback.type,
      message: feedback.message
    });
  }, [feedback, showToast]);

  if (!feedback) {
    return null;
  }

  return null;
}
