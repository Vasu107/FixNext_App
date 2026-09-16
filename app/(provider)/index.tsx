import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import Svg, {
  Polyline,
} from "react-native-svg";

// ==================================================
// CONSTANTS
// ==================================================

const { width } = Dimensions.get("window");

const BLUE = "#2B719E";
const DARK = "#17202A";
const TEXT = "#344054";
const MUTED = "#98A2B3";
const LIGHT_BG = "#F6F9FB";
const GREEN = "#18B978";
const LIGHT_GREEN = "#E7FAF2";

// ==================================================
// TYPES
// ==================================================

type IoniconName =
  React.ComponentProps<typeof Ionicons>["name"];

type ActivityItemProps = {
  icon: IoniconName;
  title: string;
  subtitle: string;
  amount: string;
  positive?: boolean;
};

// ==================================================
// EARNINGS CHART
// ==================================================

function EarningsChart() {
  const chartWidth = Math.max(width - 76, 250);

  const points = [
    [0, 70],
    [25, 58],
    [50, 64],
    [75, 43],
    [100, 50],
    [125, 27],
    [150, 34],
    [175, 17],
    [200, 25],
    [225, 10],
    [250, 19],
    [275, 2],
  ];

  const pointsString = points
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <View style={styles.earningsChart}>
      <Svg
        width={chartWidth}
        height={95}
        viewBox="0 0 275 95"
      >
        <Polyline
          points={pointsString}
          fill="none"
          stroke={BLUE}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

// ==================================================
// CASH FLOW CHART
// ==================================================

function CashFlowChart() {
  const income = [
    42,
    37,
    52,
    49,
    64,
    70,
    54,
  ];

  const expense = [
    10,
    8,
    13,
    10,
    14,
    12,
    9,
  ];

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  return (
    <View style={styles.cashChart}>

      {/* Y AXIS */}

      <View style={styles.yAxis}>
        <Text style={styles.axisText}>
          ₹800
        </Text>

        <Text style={styles.axisText}>
          ₹600
        </Text>

        <Text style={styles.axisText}>
          ₹400
        </Text>

        <Text style={styles.axisText}>
          ₹200
        </Text>

        <Text style={styles.axisText}>
          ₹0
        </Text>
      </View>

      {/* CHART */}

      <View style={styles.chartArea}>

        {/* GRID LINES */}

        {[0, 1, 2, 3, 4].map(
          (item) => (
            <View
              key={item}
              style={[
                styles.gridLine,
                {
                  top: item * 23,
                },
              ]}
            />
          )
        )}

        {/* BARS */}

        <View style={styles.barsRow}>
          {income.map(
            (value, index) => (
              <View
                key={days[index]}
                style={styles.barGroup}
              >
                <View style={styles.barPair}>

                  <View
                    style={[
                      styles.incomeBar,
                      {
                        height: value,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.expenseBar,
                      {
                        height:
                          expense[index],
                      },
                    ]}
                  />

                </View>

                <Text style={styles.dayText}>
                  {days[index]}
                </Text>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );
}



// ==================================================
// EARNINGS CARD
// ==================================================

function EarningsCard() {
  return (
    <View style={styles.card}>

      <View style={styles.earningsHeader}>

        <View>
          <Text style={styles.smallLabel}>
            Today's Earnings
          </Text>

          <Text style={styles.earningsAmount}>
            ₹2,480
            <Text style={styles.decimal}>
              .50
            </Text>
          </Text>
        </View>

        <View style={styles.percentBadge}>

          <Ionicons
            name="trending-up"
            size={11}
            color={GREEN}
          />

          <Text style={styles.percentText}>
            +18%
          </Text>

        </View>
      </View>

      <EarningsChart />

      {/* STATS */}

      <View style={styles.statsRow}>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>
            Completed
          </Text>

          <Text style={styles.statValue}>
            4
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>
            Rating
          </Text>

          <Text style={styles.statValue}>
            4.95 ⭐
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>
            Completion
          </Text>

          <Text style={styles.statValue}>
            98%
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>
            Hours
          </Text>

          <Text style={styles.statValue}>
            6.5
          </Text>
        </View>

      </View>
    </View>
  );
}

// ==================================================
// CASH FLOW CARD
// ==================================================

function CashFlowCard() {
  return (
    <View style={styles.card}>

      <View style={styles.cashHeader}>

        <Text style={styles.sectionTitle}>
          Cash Flow
        </Text>

        <View style={styles.legend}>

          <View style={styles.legendItem}>

            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    BLUE,
                },
              ]}
            />

            <Text style={styles.legendText}>
              Income
            </Text>

          </View>

          <View style={styles.legendItem}>

            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    "#98A2B3",
                },
              ]}
            />

            <Text style={styles.legendText}>
              Expense
            </Text>

          </View>

        </View>
      </View>

      <CashFlowChart />

      {/* SUMMARY */}

      <View style={styles.cashSummary}>

        <View
          style={[
            styles.summaryBox,
            styles.netBox,
          ]}
        >
          <Text style={styles.summaryLabel}>
            Net Margin
          </Text>

          <Text style={styles.netValue}>
            +78%
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>
            Pending Payouts
          </Text>

          <Text style={styles.pendingValue}>
            ₹1,200
          </Text>
        </View>

      </View>
    </View>
  );
}

// ==================================================
// UPCOMING JOB
// ==================================================

function UpcomingJob() {
  return (
    <View>

      <Text style={styles.mainSectionTitle}>
        Upcoming Jobs
      </Text>

      <View style={styles.jobCard}>

        {/* HEADER */}

        <View style={styles.nextHeader}>

          <Text style={styles.nextText}>
            NEXT SERVICE
          </Text>

          <View style={styles.liveContainer}>

            <View style={styles.liveDot} />

            <Text style={styles.liveText}>
              Live
            </Text>

          </View>
        </View>

        {/* CONTENT */}

        <View style={styles.jobContent}>

          <View style={styles.jobTitleRow}>

            <View
              style={
                styles.jobTitleContainer
              }
            >
              <Text style={styles.jobTitle}>
                Bathroom Deep Cleaning
              </Text>

              <Text
                style={styles.jobSubtitle}
              >
                Cleaning • 4 hrs • paid
              </Text>
            </View>

            <Text style={styles.jobPrice}>
              ₹850.00
            </Text>

          </View>

          {/* DETAILS */}

          <View style={styles.jobDetails}>

            <View style={styles.detailItem}>

              <Ionicons
                name="time-outline"
                size={14}
                color={TEXT}
              />

              <Text
                style={
                  styles.detailItemText
                }
              >
                11:30
              </Text>

            </View>

            <View style={styles.detailItem}>

              <Ionicons
                name="person-outline"
                size={14}
                color={TEXT}
              />

              <Text
                style={
                  styles.detailItemText
                }
              >
                Rahul Sharma
              </Text>

            </View>

            <View style={styles.detailItem}>

              <Ionicons
                name="location-outline"
                size={14}
                color={TEXT}
              />

              <Text
                style={
                  styles.detailItemText
                }
              >
                2.5 km
              </Text>

            </View>

          </View>

          {/* NAVIGATION */}

          <TouchableOpacity
            style={styles.navigationButton}
            activeOpacity={0.8}
          >

            <Ionicons
              name="navigate"
              size={15}
              color="#FFFFFF"
            />

            <Text
              style={styles.navigationText}
            >
              Navigate to Site
            </Text>

          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

// ==================================================
// ACTIVITY ITEM
// ==================================================

function ActivityItem({
  icon,
  title,
  subtitle,
  amount,
  positive = false,
}: ActivityItemProps) {
  return (
    <View style={styles.activityItem}>

      <View
        style={[
          styles.activityIcon,
          positive
            ? styles.greenIcon
            : styles.grayIcon,
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={
            positive
              ? GREEN
              : BLUE
          }
        />
      </View>

      <View style={styles.activityInfo}>

        <Text style={styles.activityTitle}>
          {title}
        </Text>

        <Text
          style={styles.activitySubtitle}
        >
          {subtitle}
        </Text>

      </View>

      <Text
        style={[
          styles.activityAmount,
          positive
            ? styles.positiveAmount
            : styles.normalAmount,
        ]}
      >
        {amount}
      </Text>

    </View>
  );
}

// ==================================================
// RECENT ACTIVITY
// ==================================================

function RecentActivity() {
  return (
    <View style={styles.activitySection}>

      <Text style={styles.mainSectionTitle}>
        Recent Activity
      </Text>

      {/* SEARCH */}

      <View style={styles.searchBox}>

        <Ionicons
          name="search-outline"
          size={17}
          color={MUTED}
        />

        <TextInput
          placeholder="Search jobs & invoices"
          placeholderTextColor="#AAB4C0"
          style={styles.searchInput}
        />

      </View>

      {/* FILTERS */}

      <View style={styles.filters}>

        <TouchableOpacity
          style={[
            styles.filterButton,
            styles.activeFilter,
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={
              styles.activeFilterText
            }
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.8}
        >
          <Text style={styles.filterText}>
            Completed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.8}
        >
          <Text style={styles.filterText}>
            Payments
          </Text>
        </TouchableOpacity>

      </View>

      {/* ITEMS */}

      <ActivityItem
        icon="checkmark-circle"
        title="Kitchen Cleaning"
        subtitle="Today • 11:20 AM"
        amount="+₹850.00"
        positive
      />

      <ActivityItem
        icon="cart-outline"
        title="Material: Cleaning Supplies"
        subtitle="Yesterday • 06:30 AM"
        amount="-₹150.00"
      />

      <ActivityItem
        icon="checkmark-circle"
        title="AC Repair Service"
        subtitle="23 Aug • 02:00 PM"
        amount="+₹1,300.00"
        positive
      />

    </View>
  );
}

// ==================================================
// MAIN SCREEN
// ==================================================

export default function Index() {
  return (
    <View style={styles.root}>

      <SafeAreaView
        style={styles.safeArea}
        edges={[]}
      >

        {/* CONTENT */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          <EarningsCard />

          <CashFlowCard />

          <UpcomingJob />

          <RecentActivity />

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  // -----------------------------------------------
  // ROOT
  // -----------------------------------------------

  root: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  safeArea: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // -----------------------------------------------
  // CARDS
  // -----------------------------------------------

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 18,

    marginBottom: 16,

    shadowColor: "#101828",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.06,

    shadowRadius: 8,

    elevation: 2,
  },

  // -----------------------------------------------
  // EARNINGS
  // -----------------------------------------------

  earningsHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-start",
  },

  smallLabel: {
    fontSize: 10,

    color: MUTED,

    fontWeight: "600",

    marginBottom: 3,
  },

  earningsAmount: {
    fontSize: 27,

    fontWeight: "800",

    color: "#101828",
  },

  decimal: {
    color: "#718096",

    fontSize: 21,
  },

  percentBadge: {
    paddingHorizontal: 8,

    paddingVertical: 5,

    borderRadius: 5,

    backgroundColor: LIGHT_GREEN,

    flexDirection: "row",

    alignItems: "center",

    gap: 2,
  },

  percentText: {
    color: GREEN,

    fontSize: 9,

    fontWeight: "800",
  },

  earningsChart: {
    height: 95,

    marginTop: 8,

    justifyContent: "center",
  },

  statsRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginTop: 2,
  },

  stat: {
    alignItems: "center",

    flex: 1,
  },

  statLabel: {
    color: MUTED,

    fontSize: 8,

    marginBottom: 4,
  },

  statValue: {
    color: TEXT,

    fontSize: 10,

    fontWeight: "700",
  },

  // -----------------------------------------------
  // CASH FLOW
  // -----------------------------------------------

  cashHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 16,

    fontWeight: "800",

    color: DARK,
  },

  legend: {
    flexDirection: "row",

    gap: 12,
  },

  legendItem: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,
  },

  legendDot: {
    width: 8,

    height: 8,

    borderRadius: 2,
  },

  legendText: {
    fontSize: 9,

    color: MUTED,
  },

  cashChart: {
    height: 170,

    flexDirection: "row",

    marginTop: 15,
  },

  yAxis: {
    width: 37,

    height: 115,

    justifyContent: "space-between",

    alignItems: "flex-end",

    paddingRight: 5,
  },

  axisText: {
    fontSize: 8,

    color: MUTED,
  },

  chartArea: {
    flex: 1,

    height: 125,

    position: "relative",
  },

  gridLine: {
    position: "absolute",

    left: 0,

    right: 0,

    borderTopWidth: 1,

    borderColor: "#EEF2F5",

    borderStyle: "dotted",
  },

  barsRow: {
    position: "absolute",

    left: 5,

    right: 5,

    top: 2,

    height: 120,

    flexDirection: "row",

    justifyContent: "space-around",
  },

  barGroup: {
    alignItems: "center",

    width: 30,
  },

  barPair: {
    height: 105,

    flexDirection: "row",

    alignItems: "flex-end",

    gap: 3,
  },

  incomeBar: {
    width: 6,

    borderRadius: 4,

    backgroundColor: BLUE,
  },

  expenseBar: {
    width: 6,

    borderRadius: 4,

    backgroundColor: "#98A2B3",
  },

  dayText: {
    fontSize: 8,

    color: MUTED,

    marginTop: 7,
  },

  cashSummary: {
    flexDirection: "row",

    gap: 10,
  },

  summaryBox: {
    flex: 1,

    minHeight: 68,

    borderRadius: 12,

    backgroundColor: "#FAFBFC",

    padding: 13,

    justifyContent: "center",
  },

  netBox: {
    backgroundColor: "#EFF8FD",
  },

  summaryLabel: {
    fontSize: 9,

    color: MUTED,

    marginBottom: 5,
  },

  netValue: {
    fontSize: 18,

    fontWeight: "800",

    color: BLUE,
  },

  pendingValue: {
    fontSize: 17,

    fontWeight: "800",

    color: DARK,
  },

  // -----------------------------------------------
  // UPCOMING JOB
  // -----------------------------------------------

  mainSectionTitle: {
    fontSize: 16,

    fontWeight: "800",

    color: DARK,

    marginBottom: 10,
  },

  jobCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    overflow: "hidden",

    marginBottom: 22,

    shadowColor: "#101828",

    shadowOffset: {
      width: 0,

      height: 3,
    },

    shadowOpacity: 0.06,

    shadowRadius: 7,

    elevation: 2,
  },

  nextHeader: {
    height: 36,

    paddingHorizontal: 14,

    backgroundColor: "#172027",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  nextText: {
    color: "#FFFFFF",

    fontSize: 9,

    fontWeight: "800",
  },

  liveContainer: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,
  },

  liveDot: {
    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor: GREEN,
  },

  liveText: {
    color: GREEN,

    fontSize: 8,

    fontWeight: "700",
  },

  jobContent: {
    padding: 16,
  },

  jobTitleRow: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  jobTitleContainer: {
    flex: 1,

    paddingRight: 10,
  },

  jobTitle: {
    fontSize: 15,

    fontWeight: "800",

    color: DARK,
  },

  jobSubtitle: {
    color: MUTED,

    fontSize: 9,

    marginTop: 5,
  },

  jobPrice: {
    fontSize: 15,

    color: BLUE,

    fontWeight: "800",
  },

  jobDetails: {
    flexDirection: "row",

    alignItems: "center",

    gap: 10,

    marginTop: 13,

    flexWrap: "wrap",
  },

  detailItem: {
    flexDirection: "row",

    alignItems: "center",

    gap: 3,
  },

  detailItemText: {
    fontSize: 8,

    color: TEXT,
  },

  navigationButton: {
    height: 40,

    marginTop: 14,

    borderRadius: 9,

    backgroundColor: "#2B83B5",

    alignItems: "center",

    justifyContent: "center",

    flexDirection: "row",

    gap: 7,
  },

  navigationText: {
    color: "#FFFFFF",

    fontSize: 11,

    fontWeight: "700",
  },

  // -----------------------------------------------
  // RECENT ACTIVITY
  // -----------------------------------------------

  activitySection: {
    marginBottom: 20,
  },

  searchBox: {
    height: 42,

    backgroundColor: "#FFFFFF",

    borderRadius: 10,

    paddingHorizontal: 12,

    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderColor: "#EDF1F4",

    marginBottom: 10,
  },

  searchInput: {
    flex: 1,

    marginLeft: 8,

    fontSize: 11,

    color: TEXT,
  },

  filters: {
    flexDirection: "row",

    gap: 8,

    marginBottom: 12,
  },

  filterButton: {
    paddingHorizontal: 13,

    paddingVertical: 7,

    borderRadius: 15,

    backgroundColor: "#FFFFFF",
  },

  activeFilter: {
    backgroundColor: BLUE,
  },

  filterText: {
    fontSize: 9,

    color: "#667085",

    fontWeight: "600",
  },

  activeFilterText: {
    fontSize: 9,

    color: "#FFFFFF",

    fontWeight: "700",
  },

  activityItem: {
    minHeight: 66,

    backgroundColor: "#FFFFFF",

    borderRadius: 12,

    paddingHorizontal: 12,

    paddingVertical: 10,

    marginBottom: 8,

    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderColor: "#F0F3F5",
  },

  activityIcon: {
    width: 36,

    height: 36,

    borderRadius: 10,

    alignItems: "center",

    justifyContent: "center",
  },

  greenIcon: {
    backgroundColor: "#E9FAF3",
  },

  grayIcon: {
    backgroundColor: "#F0F4F7",
  },

  activityInfo: {
    flex: 1,

    marginLeft: 10,
  },

  activityTitle: {
    fontSize: 11,

    fontWeight: "800",

    color: DARK,
  },

  activitySubtitle: {
    fontSize: 8,

    color: MUTED,

    marginTop: 3,
  },

  activityAmount: {
    fontSize: 10,

    fontWeight: "800",
  },

  positiveAmount: {
    color: GREEN,
  },

  normalAmount: {
    color: "#667085",
  },
});