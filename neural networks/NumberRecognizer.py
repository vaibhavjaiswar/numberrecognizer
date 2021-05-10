from matplotlib import pyplot as plt
import numpy as np

# ------------------- Reading image file --------------------- #
file = open('../img/numbers/data.txt', 'r')
string = file.read()    
line = string.split('\n')
n = len(line)
#print(n)
index = 11 * 0
data = []
expected = []
n_of_output = 10

while index < 11 * 4 * n_of_output:
    number = int(line[index])
    index += 1
    img = line[index:index+10]
    for row in range(len(img)):
        img[row] = list(map(float, img[row].split(' ')))
    index += 10
    #print('Number:', number)
    #for row in img:
    #    print(row)
    #plt.imshow(img)
    #plt.show()
    data.append(np.array(img))
    enum = [0 for i in range(n_of_output)]      # len depends on num of possible results
    enum[number] = 1
    expected.append(enum)
length = len(data)
print(len(data), ' images.','Each size :', data[0].shape)
print('Changing (10,10) to (100,1)')
for i in range(length):
    data[i] = data[i].reshape(100,)

print('Data', np.array(data).shape, '\n', data)
print('Target', np.array(expected).shape, '\n', np.array(expected))

# ------------------- Neural Network --------------------- #

def sigmoid(A):
    return 1/(1+np.exp(-A))

def d_sigmoid(A):
    B = sigmoid(A)
    return B * (1 - B)

# forward propagation
def forward():
    global X, W1, A1, L1, W2, A2, L2, W3, A3, Y, T, E
    #print('W1', W1.shape, '\n', W1)
    A1 = np.dot(X,W1)
    L1 = sigmoid(A1)
    #print('L1 = sigmoid(X*W1)', L1.shape, '\n', L1)
    #print('W2', W2.shape, '\n', W2)
    
    A2 = np.dot(L1,W2)
    L2 = sigmoid(A2)
    #print('L2 = sigmoid(L1*W2)', L2.shape, '\n', L2)
    #print('W3', W3.shape, '\n', W3)

    A3 = np.dot(L2,W3)
    Y = sigmoid(A3)
    #print('Y = sigmoid(L2*W3) (NN output)', Y.shape, '\n', Y)

    E = ((T - Y)**2) / 2
    #print('E (error)', E.shape, '\n', E)
    #print('Total Error:', E.sum())

# back propagation
def backward():
    global X, W1, A1, L1, W2, A2, L2, W3, A3, Y, T, E
    #temp = (Y - T) * d_sigmoid(A3)
    #dW3 = np.dot(L2.T, temp)
    #dW2 = np.dot(L1.T, np.dot((Y-T), W3.T) * d_sigmoid(A2))
    #dW1 = np.dot(X.T, np.dot(temp, W3.T) * np.dot((d_sigmoid(A2)*d_sigmoid(A1)), W2))
    temp1 = (Y - T) * d_sigmoid(A3)
    dW3 = np.dot(L2.T, temp1)
    temp2 = np.dot(temp1, W3.T) * d_sigmoid(A2)
    dW2 = np.dot(L1.T, temp2)
    temp3 = np.dot(temp2, W2.T) * d_sigmoid(A1)
    dW1 = np.dot(X.T, temp3)
    oldW1 = W1
    oldW2 = W2
    oldW3 = W3
    W1 = oldW1 - learn_rate * dW1
    W2 = oldW2 - learn_rate * dW2
    W3 = oldW3 - learn_rate * dW3
    #print('dW1\n', dW1)
    #print('dW2\n', dW2)

def think(X_):
    global W1, W2, W3
    A1_ = np.dot(X_, W1)
    L1_ = sigmoid(A1_)
    A2_ = np.dot(L1_, W2)
    L2_ = sigmoid(A2_)
    A3_ = np.dot(L2_, W3)
    Y_ = sigmoid(A3_)
    print(Y_)

print('\nNeural Network Layers')
n = 2    #2
nBy2 = n / 2
np.random.seed(59)
learn_rate = 1    # 0.8

layer1_len = 20    # 20
layer2_len = 8    # 20

X = np.array(data)
#X = np.array(data[start:end])
W1 = n*np.random.rand(100,layer1_len)-nBy2
A1 = np.dot(X,W1)

L1 = sigmoid(A1)
W2 = n*np.random.rand(layer1_len,layer2_len)-nBy2
A2 = np.dot(L1,W2)

L2 = sigmoid(A2)
W3 = n*np.random.rand(layer2_len,len(expected[0]))-nBy2
A3 = np.dot(L2,W3)
Y = sigmoid(A3)

T = np.array(expected)#.reshape(Y.shape[0], Y.shape[1])
E = ((T - Y)**2) / 2
'''
print('X (training data)', X.shape, '\n', X)
print('T (expected output)', T.shape, '\n', T)
print('W1', W1.shape, '\n', W1)
print('L1 = sigmoid(X*W1)', L1.shape, '\n', L1)
print('W2', W2.shape, '\n', W2)
print('L2 = sigmoid(L1*W2)', L2.shape, '\n', L2)
print('W3', W3.shape, '\n', W3)
print('Y = sigmoid(L2*W2) (NN output)', Y.shape, '\n', Y)
print('E  = ((T-Y)**2)/2 (error)', E.shape, '\n', E)
'''
print('Initial Error:', E.sum())
print('Y\n', Y)

print('\nTraining Neural Network ...\n')
for i in range(50000):
    #print('Iteration', i+1)
    forward()
    backward()

print('Total Error:', E.sum())
print('Y\n', Y)
#print('T (expected output)', T.shape, '\n', T)

# ----------------- Writing weights to file ------------------
weights_str = 'const weights = \n[\n'

weights_str += '\t[\n'
for row in W1:
    weights_str += '\t\t' + np.array2string(row, separator=',') + ',\n'
weights_str = weights_str[0:-2] + '\n\t],\n'

weights_str += '\t[\n'
for row in W2:
    weights_str += '\t\t' + np.array2string(row, separator=',') + ',\n'
weights_str = weights_str[0:-2] + '\n\t],\n'

weights_str += '\t[\n'
for row in W3:
    weights_str += '\t\t' + np.array2string(row, separator=',') + ',\n'
weights_str = weights_str[0:-2] + '\n\t]\n'

weights_str += ']\n'

print('\nWriting all weights to file\n')
file = open('weights.js', 'w')
file.write(weights_str)
file.close()
