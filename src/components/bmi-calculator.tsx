
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Scale, Weight, Calculator, Download } from "lucide-react"; // Added Download icon

type UnitSystem = "metric" | "imperial";

export function BMICalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);

  const heightLabel = unitSystem === "metric" ? "Height (cm)" : "Height";
  const weightLabel = unitSystem === "metric" ? "Weight (kg)" : "Weight (lbs)";

  const calculateBMI = () => {
    setIsCalculating(true);
    setBmi(null); // Reset BMI before calculating

    const hNum = parseFloat(height);
    const wNum = parseFloat(weight);
    const hfNum = parseFloat(heightFeet);
    const hiNum = parseFloat(heightInches);

    let calculatedBmi: number | null = null;

    if (unitSystem === "metric") {
      if (hNum > 0 && wNum > 0) {
        const heightInMeters = hNum / 100;
        calculatedBmi = wNum / (heightInMeters * heightInMeters);
      }
    } else { // Imperial
      const totalHeightInInches = (hfNum * 12) + (hiNum || 0);
      if (totalHeightInInches > 0 && wNum > 0) {
        calculatedBmi = (wNum / (totalHeightInInches * totalHeightInInches)) * 703;
      }
    }

    // Simulate calculation time for animation effect
    setTimeout(() => {
       if (calculatedBmi !== null && !isNaN(calculatedBmi)) {
         setBmi(parseFloat(calculatedBmi.toFixed(1)));
       } else {
         setBmi(null); // Set to null if calculation is invalid
       }
      setIsCalculating(false);
    }, 500); // 0.5 second delay
  };

  const { category, color } = useMemo(() => {
    if (bmi === null) return { category: "", color: "" };
    // Using Tailwind classes directly for specific color feedback
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { category: "Normal weight", color: "text-green-500" };
    if (bmi < 30) return { category: "Overweight", color: "text-orange-500" };
    return { category: "Obese", color: "text-red-500" };
  }, [bmi]);

  // Reset inputs when unit system changes
  useEffect(() => {
    setHeight("");
    setWeight("");
    setHeightFeet("");
    setHeightInches("");
    setBmi(null);
  }, [unitSystem]);

  const handleUnitChange = (value: UnitSystem) => {
    setUnitSystem(value);
  }

  const isInputValid = useMemo(() => {
     const wNum = parseFloat(weight);
     if (unitSystem === 'metric') {
       const hNum = parseFloat(height);
       return hNum > 0 && wNum > 0;
     } else {
        const hfNum = parseFloat(heightFeet);
        const hiNum = parseFloat(heightInches || "0"); // Treat empty inches as 0
        // Ensure feet is positive, weight is positive, and inches are non-negative
        return hfNum > 0 && wNum > 0 && hiNum >= 0;
     }
  }, [height, weight, heightFeet, heightInches, unitSystem]);

  // Function to handle downloading the result
  const downloadResult = () => {
    if (bmi === null) return;

    const resultText = `BMI Result:
------------------
BMI: ${bmi}
Category: ${category}
Date: ${new Date().toLocaleDateString()}
------------------
Calculated using BMI Buddy
`;

    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bmi_result_${new Date().toISOString().split('T')[0]}.txt`; // Filename like bmi_result_YYYY-MM-DD.txt
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <Card className="w-full max-w-md shadow-lg bg-card border border-border rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <Calculator className="h-6 w-6"/> BMI Calculator
        </CardTitle>
        <CardDescription>Enter your height and weight to calculate your BMI.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          defaultValue="metric"
          onValueChange={handleUnitChange}
          className="flex space-x-4"
          aria-label="Unit System"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="metric" id="metric" />
            <Label htmlFor="metric">Metric (cm, kg)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imperial" id="imperial" />
            <Label htmlFor="imperial">Imperial (ft, in, lbs)</Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="height" className="flex items-center gap-1 text-foreground">
             <Scale className="h-4 w-4 text-muted-foreground" />
             {heightLabel}
          </Label>
          {unitSystem === "metric" ? (
            <Input
              id="height"
              type="number"
              placeholder="e.g., 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="0"
              className="bg-input text-foreground border-input placeholder:text-muted-foreground"
            />
          ) : (
            <div className="flex gap-2">
              <Input
                id="heightFeet"
                type="number"
                placeholder="Feet"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                min="1" // Minimum 1 foot
                aria-label="Height in feet"
                className="bg-input text-foreground border-input placeholder:text-muted-foreground"
              />
              <Input
                id="heightInches"
                type="number"
                placeholder="Inches"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                min="0"
                max="11"
                aria-label="Height in inches"
                className="bg-input text-foreground border-input placeholder:text-muted-foreground"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
           <Label htmlFor="weight" className="flex items-center gap-1 text-foreground">
             <Weight className="h-4 w-4 text-muted-foreground"/>
             {weightLabel}
           </Label>
          <Input
            id="weight"
            type="number"
            placeholder={unitSystem === "metric" ? "e.g., 70" : "e.g., 150"}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="1" // Minimum weight of 1
            className="bg-input text-foreground border-input placeholder:text-muted-foreground"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        <Button
         onClick={calculateBMI}
         className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
         disabled={isCalculating || !isInputValid}
         aria-live="polite"
         >
          {isCalculating ? "Calculating..." : "Calculate BMI"}
        </Button>

        {isCalculating && (
           <div className="w-full bg-muted rounded-full h-2.5">
             <div className="bg-accent h-2.5 rounded-full animate-pulse"></div> {/* Subtle loading pulse */}
           </div>
        )}

        {bmi !== null && !isCalculating && (
          <div className="text-center transition-opacity duration-500 ease-in pt-4 w-full">
            <p className="text-lg font-semibold text-foreground">Your BMI is:</p>
            <p className={`text-4xl font-bold ${color}`}>{bmi}</p>
            <p className={`text-lg font-medium ${color}`}>({category})</p>
            <Button
              onClick={downloadResult}
              variant="outline"
              className="mt-4"
              aria-label="Download BMI Result"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Result
            </Button>
          </div>
        )}
         {bmi === null && !isCalculating && !isInputValid && (height || weight || heightFeet || heightInches) && (
            <p className="text-sm text-destructive text-center pt-2">Please enter valid positive numbers for height and weight.</p>
        )}
      </CardFooter>
    </Card>
  );
}

