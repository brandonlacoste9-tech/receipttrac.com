#!/bin/bash
# Antigravity IDX: YOLO & Spawn Agent Automation

echo "--- INITIALIZING ANTIGRAVITY ---"

# Step 1: Force YOLO Mode
idx mode set yolo --force --no-confirm

# Step 2: Spawn Agents in Autonomous Mode
idx agent spawn --count 3 --type autonomous --detach --live

# Step 3: Verify Status
echo "Current Mode: $(idx mode status)"
echo "Active Agents: $(idx agent list --count)"

echo "--- SYSTEM UNLOCKED ---"
